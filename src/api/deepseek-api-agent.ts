'use client'

import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";  // 这个保持不变
import { tool } from "langchain";                                    // ← 关键修改！
import { z } from "zod";

import { ChatMessage } from "@/schema/chat-message";
import { ChatSession } from "@/schema/chat-session";
import { ChatApi, ChatConfig, generateSystemMessage } from "@/api/index";
import { SetStateAction } from "react";

import { useApiKeyStore } from "@/store/api-key-store";

// 限制历史消息数量（包含系统消息后）
const historyMessageCount = 8; // 多留点空间给 tool messages

// ===== 新工具定义（用 tool + zod schema）=====

const echoTool = tool(
  async ({ input }: { input: string }) => {
    console.log("调用了回音工具");
    return `回音:111111 ${input}`;
  },
  {
    name: "echo",
    description: "当用户要求重复或说'回音'时使用此工具。输入应该是需要重复的文本，即用户最开始说的话内容",
    schema: z.object({
      input: z.string().describe("需要重复的文本"),
    }),
  }
);

const weatherTool = tool(
  async ({ city }: { city: string }) => {
    console.log("调用了天气工具");
    // 这里可以模拟延迟，让 streaming 更明显
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `今天${city}天气晴天，温度 30 度。`;
  },
  {
    name: "weather",
    description: "获取指定城市的实时天气信息。输入应为城市名，如“北京”。",
    schema: z.object({
      city: z.string().describe("城市名称"),
    }),
  }
);

// 数独工具保持不变（只需加 schema）
const SudokuSolverTool = tool(
  async ({ input }: { input: string }) => {
    console.log("使用了解数独工具");

    let board: number[][];
    try {
      board = JSON.parse(input);
    } catch (e) {
      const nums = input.split(',').map(n => parseInt(n.trim(), 10));
      if (nums.length !== 81) {
        throw new Error("输入必须是 81 个数字组成的 9x9 数独（JSON 或逗号分隔）");
      }
      board = [];
      for (let i = 0; i < 9; i++) {
        board.push(nums.slice(i * 9, (i + 1) * 9));
      }
    }

    const solved = solveSudoku(board);
    if (!solved) {
      return "无法解出该数独。请检查输入是否有效。";
    }
    return JSON.stringify(board);
  },
  {
    name: "solve_sudoku",
    description: "解一个9x9的数独游戏。输入可以是二维数组 JSON 或逗号分隔的 81 个数字字符串，0 表示空格。",
    schema: z.object({
      input: z.string().describe("数独棋盘，JSON 数组或逗号分隔字符串"),
    }),
  }
);

// 数独求解函数（保持原样）
function isValid(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num ||
        board[Math.floor(row / 3) * 3 + Math.floor(i / 3)][Math.floor(col / 3) * 3 + (i % 3)] === num) {
      return false;
    }
  }
  return true;
}

function solveSudoku(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// ===== Agent 类实现 =====
export class DeepseekApiAgent implements ChatApi {
  stopStream = false;
  private agent: any; // createReactAgent 返回的 Runnable

  constructor() {
    // 在构造函数中预先创建 agent（模型和工具固定）
    const apiInformation = useApiKeyStore.getState().getKey("Deepseek R1") || {
      url: "",
      key: "",
    };

    const model = new ChatOpenAI({
      temperature: 0,
      streaming: true,
      openAIApiKey: apiInformation.key,
      modelName: "deepseek-chat",
      configuration: {
        baseURL: apiInformation.url,
      },
    });

    this.agent = createReactAgent({
      llm: model,
      tools: [echoTool, weatherTool, SudokuSolverTool],
    });
  }

  async sendMessage(config: ChatConfig, updater: (action: SetStateAction<ChatSession>) => void) {
    const userMessage = config.userMessage;
    if (!userMessage) return;

    // 创建空的 bot 消息
    const botMessage: ChatMessage = {
      role: "assistant",
      contents: [""],
      streaming: true,
      thinking: undefined,
    };

    updater(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage, botMessage],
      streaming: true,
    }));

    // 生成系统消息 + 历史消息（转成 LangChain 格式）
    const systemMessages = generateSystemMessage(); // 假设返回 ChatMessage[]
    const recentMessages = config.session?.messages.slice(-historyMessageCount) ?? [];

    const messagesForAgent = [
      ...systemMessages,
      ...recentMessages,
      userMessage,
    ].map(msg => ({
      role: msg.role === "assistant" ? "assistant" : "human", // LangGraph 用 human/ai
      content: msg.contents.join("\n"),
    }));

    let finalOutput = "";

    try {
      // 使用 stream 支持完美逐 token 更新
      const stream = await this.agent.stream({
        messages: messagesForAgent,
      });

      for await (const chunk of stream) {
        if (this.stopStream) break;

        // chunk 可能是 { messages: [...] } 或直接 AIMessageChunk
        if (chunk.messages?.length) {
          const lastMsg = chunk.messages[chunk.messages.length - 1];
          if (lastMsg.role === "assistant" && lastMsg.content) {
            finalOutput += lastMsg.content;
          }
        } else if (chunk.content) {
          finalOutput += chunk.content;
        }

        botMessage.contents[0] = finalOutput;
        updater(prev => ({
          ...prev,
          messages: [...prev.messages], // 触发 React 更新
          streaming: true,
        }));
      }
    } catch (error) {
      finalOutput += `\n\n[错误: ${error}]`;
      botMessage.contents[0] = finalOutput;
    }

    // 结束 streaming
    botMessage.streaming = false;
    updater(prev => ({ ...prev, streaming: false }));
  }

  stop() {
    this.stopStream = true;
  }

  // query 方法保持不变（非 agent 调用时用）
  async query(messages: ChatMessage[]): Promise<string> {
    // ... 原代码不变
  }
}