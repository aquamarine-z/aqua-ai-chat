'use client'

import {ChatOpenAI} from "@langchain/openai";
import {initializeAgentExecutorWithOptions} from "langchain/agents";
import {DynamicTool} from "langchain/tools";
import {ChatMessage} from "@/schema/chat-message";
import {ChatSession} from "@/schema/chat-session";
import {ChatApi, ChatConfig, generateSystemMessage} from "@/api/index";
import {SetStateAction} from "react";

import {useApiKeyStore} from "@/store/api-key-store";

// 限制历史消息数量
const historyMessageCount = 4;

export class DeepseekApiAgent implements ChatApi {
    stopStream = false;

    /**
     * 主函数：发送用户消息到 Agent，处理响应
     */
    async sendMessage(config: ChatConfig, updater: (action: SetStateAction<ChatSession>) => void) {
        const userMessage = config.userMessage;
        if (!userMessage) return;

        // 创建空的 bot 消息（开始 streaming 状态）
        const botMessage: ChatMessage = {
            role: "assistant",
            contents: [""],
            streaming: true,
            thinking: undefined
        };

        // 将用户消息和 bot 消息添加到对话
        updater(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage, botMessage],
            streaming: true
        }));

        // 检查 API Key（支持 /set-key 命令）
        const apiInformation = useApiKeyStore.getState().getKey("Deepseek R1") || {
            url: "",
            key: "",
        }
        const key = apiInformation.key
        const url = apiInformation.url
        // ===== 🧠 Step 1: 构建 LangChain Agent =====

        // 初始化模型（绑定 DeepSeek baseURL）
        const model = new ChatOpenAI({
            temperature: 0,
            streaming: true,
            openAIApiKey: key,
            modelName: "deepseek-chat",
            configuration: {
                baseURL: apiInformation.url
            }
        });
        let finalOutput = "";
        // 示例工具：返回你说的任何内容
        const echoTool = new DynamicTool({
            name: "echo",
            description: "当用户要求重复或说'回音'时使用此工具。输入应该是需要重复的文本，即用户最开始说的话内容",
            func: async (input: string) => {
                console.log("调用了回音API")
                return `回音:111111 ${input}`
            }
        });

        const weatherTool = new DynamicTool({
            name: "weather",
            description: "获取指定城市的实时天气信息。输入应为城市名，如“北京”。",
            func: async (input: string) => {
                console.log("调用了天气API");
                finalOutput += "调用天气API 查找温度"
                botMessage.contents[0] = finalOutput
                updater(prev => ({
                    ...prev,
                    messages: [...prev.messages], // 用深拷贝触发更新
                    streaming: true
                }));
                return await new Promise((resolve) => {
                    setTimeout(() => {
                        finalOutput += `\n ${input}的温度为 30度\n`
                        botMessage.contents[0] = finalOutput
                        updater(prev => ({
                            ...prev,
                            messages: [...prev.messages], // 用深拷贝触发更新
                            streaming: true
                        }));
                        resolve(`今天天气是晴天 30度，城市是：${input}`);
                    }, 1000);
                });
            }
        });

        console.log(key, url)
        // 初始化 agent
        const executor = await initializeAgentExecutorWithOptions(
            [echoTool, weatherTool, SudokuSolverTool],  // 工具列表，可添加多个
            model,
            {
                agentType: "chat-zero-shot-react-description",
                verbose: true
            }
        );

        // ===== 🧠 Step 2: 构建消息上下文 =====

        const systemMessages = generateSystemMessage() as ChatMessage[];

        // 仅保留最后 N 条历史消息，拼接系统 prompt
        const messageList = [
            ...systemMessages,
            ...(config.session?.messages.slice(-historyMessageCount) ?? []),
        ];

        // 拼成输入 prompt
        let inputPrompt = userMessage.contents[0].toString()
        inputPrompt = `'${inputPrompt}' 这是用户的问题 我要求你利用工具总结信息，并将用户的问题与使用工具获得的信息结合 重新生成一个提示词以供后续AI流式生成结果`

        // ===== 🚀 Step 3: 调用 agent（stream 模式） =====

        // 2. 传给 agent，流式调用要保证参数正确
        const streamIterator = await executor.stream({input: inputPrompt, chat_history: []});
        let executorOutput = ""
        for await (const chunk of streamIterator) {
            if (chunk.output) executorOutput += chunk.output;
            console.log(chunk.output)
            if (this.stopStream) break;
        }
        console.log(executorOutput)
        const modelStreamIterator = await model.stream(`这是用户原问题:'${userMessage.contents[0].toString()}'这是工具链调用之后AI返回的结果:'${executorOutput}' 根据原问题与工具调用结果 返回一个更好的答案提供给用户`);
        for await (const chunk of modelStreamIterator) {
            finalOutput += chunk.content
            botMessage.contents[0] = finalOutput
            updater(prev => ({
                ...prev,
                messages: [...prev.messages], // 用深拷贝触发更新
                streaming: true
            }));
        }

        // 结束 streaming 状态
        botMessage.streaming = false;
        botMessage.thinking = undefined;
        updater(prev => ({...prev, messages: prev.messages.concat(), streaming: false}));
    }

    stop() {
        this.stopStream = true;
    }

    async query(messages: ChatMessage[]): Promise<string> {
        const apiInformation = useApiKeyStore.getState().getKey("Deepseek R1") || {
            url: "",
            key: "",
        }
        if (apiInformation.url.trim() === "" || apiInformation.key.trim() === "") return ""

        return fetch(apiInformation.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiInformation.key}`,
            },
            body: JSON.stringify({
                model: "deepseek-chat", // 或 deepseek-coder / deepseek-R1，如果 R1 有对应的 identifier
                messages: messages.map((it) => ({
                    role: it.role,
                    content: it.contents.join("\n")
                })),
                stream: false,
            }),
        }).then(async data => {
            const json = await data.json()


            return json.choices[0]["message"]["content"] || ""


        });
    }
}


/**
 * 判断是否可以在指定位置放置数字
 */
function isValid(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num ||
            board[Math.floor(row / 3) * 3 + Math.floor(i / 3)][Math.floor(col / 3) * 3 + (i % 3)] === num) {
            return false;
        }
    }
    return true;
}

/**
 * 回溯求解
 */
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

/**
 * 创建动态工具
 */
export const SudokuSolverTool = new DynamicTool({
    name: "solve_sudoku",
    description: "解一个9x9的数独游戏。输入可以是二维数组或逗号分隔的字符串，0 表示空格。",
    func: async (input: string): Promise<string> => {
        console.log("使用了解数独工具")
        let board: number[][];
        try {
            board = JSON.parse(input);
        } catch (e) {
            // 如果输入是字符串格式 "1,0,0,..."
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
    }
});
