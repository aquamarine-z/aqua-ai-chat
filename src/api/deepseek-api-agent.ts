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
                baseURL: url
            }
        });

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
                console.log("调用了天气API")
                return `今天天气是晴天，城市是：${input}`
            }
        });
        console.log(key, url)
        // 初始化 agent
        const executor = await initializeAgentExecutorWithOptions(
            [echoTool, weatherTool],  // 工具列表，可添加多个
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
        const inputPrompt = userMessage.contents[0].toString()

        // ===== 🚀 Step 3: 调用 agent（stream 模式） =====

        // 2. 传给 agent，流式调用要保证参数正确
        const streamIterator = await executor.stream({input: inputPrompt, chat_history: []});

        let finalOutput = "";
        for await (const chunk of streamIterator) {
            if(chunk.output) finalOutput += chunk.output;
            console.log(chunk.output)

            botMessage.contents[0] = finalOutput;
            updater(prev => ({
                ...prev,
                messages: [...prev.messages], // 用深拷贝触发更新
                streaming: true
            }));

            if (this.stopStream) break;
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