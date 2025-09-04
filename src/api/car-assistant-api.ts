// src/api/car-recommendation-api.ts
import {ChatOpenAI} from "@langchain/openai";
import {ChatMessage} from "@/schema/chat-message";
import {ChatSession} from "@/schema/chat-session";
import {ChatApi, ChatConfig, generateSystemMessage} from "@/api/index";
import {SetStateAction} from "react";
import {useApiKeyStore} from "@/store/api-key-store";
import {initializeAgentExecutorWithOptions} from "langchain/agents";

// 限制历史消息数量
const historyMessageCount = 4;

export class CarAssistantApi implements ChatApi {
    stopStream = false;

    /**
     * 主函数：发送用户消息到 Agent，处理汽车推荐响应
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

        // 检查 API Key（复用 Deepseek R1 的配置）
        const apiInformation = useApiKeyStore.getState().getKey("Deepseek R1") || {
            url: "",
            key: "",
        }
        const key = apiInformation.key
        const url = apiInformation.url

        // 初始化模型（绑定 DeepSeek baseURL）
        const model = new ChatOpenAI({
            temperature: 0.7, // 增加一些创造性
            streaming: true,
            openAIApiKey: key,
            modelName: "deepseek-chat",
            configuration: {
                baseURL: apiInformation.url
            }
        });

        let finalOutput = "";

        // 构建消息上下文
        const systemMessages = generateSystemMessage() as ChatMessage[];

        // 仅保留最后 N 条历史消息，拼接系统 prompt
        const messageList = [
            ...systemMessages,
            ...(config.session?.messages.slice(-historyMessageCount) ?? []),
        ];

        // 拼成输入 prompt
        let inputPrompt = userMessage.contents[0].toString()
        inputPrompt = `作为一名专业的汽车推荐顾问，我需要你根据用户的需求推荐合适的汽车。用户的问题是: '${inputPrompt}'。请使用工具获取相关信息，并给出详细的推荐理由。`
        const executor = await initializeAgentExecutorWithOptions(
            [],  // 工具列表，可添加多个
            model,
            {
                agentType: "chat-zero-shot-react-description",
                verbose: true
            }
        );
        // 调用 agent（stream 模式）
        const streamIterator = await executor.stream({input: inputPrompt, chat_history: []});
        let executorOutput = ""
        for await (const chunk of streamIterator) {
            if (chunk.output) executorOutput += chunk.output;
            console.log(chunk.output)
            if (this.stopStream) break;
        }

        console.log(executorOutput)

        // 使用模型生成最终响应
        const modelStreamIterator = await model.stream(
            `这是用户原问题:'${userMessage.contents[0].toString()}'\n` +
            `这是工具链调用之后获得的信息:'${executorOutput}'\n` +
            `根据原问题与工具调用结果，以汽车顾问的身份给出专业且友好的推荐回答。`
        );

        for await (const chunk of modelStreamIterator) {
            finalOutput += chunk.content
            botMessage.contents[0] = finalOutput
            updater(prev => ({
                ...prev,
                messages: [...prev.messages],
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
                model: "deepseek-chat",
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
