'use client'
import {ChatApi, ChatConfig, generateSystemMessage} from "@/api/index";
import {SetStateAction} from "react";
import {ChatSession} from "@/schema/chat-session";
import {ChatMessage} from "@/schema/chat-message";
import {Thinking} from "@/schema/chat-message-metadata/thinking";
import {z} from "zod";
import {useApiKeyStore} from "@/store/api-key-store";

const historyMessageCount = 4;

export class OpenApi implements ChatApi {
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

    stopStream = false;

    async sendMessage(config: ChatConfig, updater: (action: SetStateAction<ChatSession>) => void) {
        const botMessage: ChatMessage = {
            role: "assistant",
            contents: [""],
            streaming: true,
            thinking: {startTime: Date.now(), content: "", finished: false} as Thinking
        }

        const userMessage = config.userMessage
        if (!userMessage) {
            return
        }
        updater(prev => {
            return {
                ...prev,
                messages: [...prev.messages, userMessage],
                streaming: true,
            }
        })
        updater(prev => {
            return {
                ...prev,
                messages: [...prev.messages, botMessage],
                streaming: true,
            }
        })

        if (userMessage.contents[0].startsWith("/")) {
            //match /set-key <key> command
            console.log("command")
            const command = userMessage.contents[0].split(" ")
            if (command[0] === "/set-key" && command.length === 2) {
                const key = command[1]

                //save key to local storage
                localStorage.setItem("deepseek-key", key)
                botMessage.contents[0] = "Key set successfully"
                botMessage.streaming = false
                botMessage.thinking = undefined
                updater(prev => {
                    return {
                        ...prev,
                        messages: prev.messages.concat(),
                        streaming: false,

                    }
                })
                return
            }
        } else {
            const apiInformation = useApiKeyStore.getState().getKey("Deepseek R1") || {
                url: "",
                key: "",
            }

            botMessage.thinking = undefined
            const key = apiInformation.key
            if (!key || key.trim() === "") {
                botMessage.contents[0] = "Please set your DeepSeek API key using /set-key <key> command"
                botMessage.streaming = false
                botMessage.thinking = undefined
                updater(prev => {
                    return {
                        ...prev,
                        messages: prev.messages.concat(),
                        streaming: false,

                    }
                })
                return
            }
            const systemMessages = generateSystemMessage() as ChatMessage[]
            const messages = [...systemMessages, ...config.session?.messages.slice(-historyMessageCount) as [], {...userMessage}] as ChatMessage[]
            const messageForRequest = messages.map(msg => {
                return {
                    role: msg.role,
                    content: msg.contents.filter(it => it.trim() !== "").join("\n") || " " // 确保内容不为空,
                }
            })

            //console.log(messageForRequest)
            //send request to deepseek api
            const response = await fetch(apiInformation.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${key}`,
                },
                body: JSON.stringify({
                    model: "deepseek-chat", // 或 deepseek-coder / deepseek-R1，如果 R1 有对应的 identifier
                    messages: messageForRequest,
                    stream: true,
                }),
            });
            if (!response.ok) {
                botMessage.contents[0] = "Error: " + response.statusText
                botMessage.streaming = false
                botMessage.thinking = undefined
                updater(prev => {
                    return {
                        ...prev,
                        messages: prev.messages.concat(),
                        streaming: false,

                    }
                })
                return
            }
            const reader = response.body?.getReader();
            if (!reader) {
                botMessage.contents[0] = "Error: No response body"
                botMessage.streaming = false
                botMessage.thinking = undefined
                updater(prev => {
                    return {
                        ...prev,
                        messages: prev.messages.concat(),
                        streaming: false,

                    }
                })
                return
            }
            let stop = false
            while (true) {
                if (this.stopStream) {
                    stop = true
                }
                const {done, value} = await reader.read();
                if (done) stop = true;
                if (stop) break;
                const text = new TextDecoder().decode(value);
                const lines = text.split("\n").filter(line => line.startsWith("data: "));
                for (const line of lines) {
                    //console.log(line)
                    const deltaRaw = line.replace("data: ", "").trim();

                    if (deltaRaw === "[DONE]") {
                        stop = true
                        //console.log("stop")
                    } else if (deltaRaw) {
                        const data = parseDataString(deltaRaw);
                        botMessage.contents[0] += data[0].choices[0].delta.content
                        updater(prev => ({...prev, messages: prev.messages.concat()}));
                    }
                }
            }
            this.stop()
            botMessage.streaming = false;
            botMessage.thinking = undefined;
            updater(prev => {
                return {
                    ...prev,
                    messages: prev.messages.concat(),
                    streaming: false,
                }
            })


        }


    }

    stop(): void {
        this.stopStream = true
    }

}

// 定义 OpenAI API 的响应结构（按 Chat Completion 流模式）
export const OpenaiResponseSchema = z.object({
    id: z.string(),
    object: z.literal("chat.completion.chunk"),
    created: z.number(),
    model: z.string(),
    choices: z.array(
        z.object({
            index: z.number(),
            delta: z.object({
                role: z.enum(["system", "user", "assistant"]).optional(),
                content: z.string().optional(),
                function_call: z.any().optional(), // 如果有函数调用，可根据需要精化
            }),
            finish_reason: z.string().nullable().optional(),
        })
    )
});

export type OpenaiResponse = z.infer<typeof OpenaiResponseSchema>;

export function parseDataString(dataString: string): OpenaiResponse[] {
    const result: OpenaiResponse[] = [];
    let startIndex = 0;
    let openBraces = 0;
    let inString = false;
    let stringChar = "";
    let escape = false;

    for (let i = 0; i < dataString.length; i++) {
        const char = dataString[i];

        if ((char === '"' || char === "'") && !escape) {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar) {
                inString = false;
            }
        }

        escape = char === "\\" && !escape;

        if (!inString) {
            if (char === "{") {
                if (openBraces === 0) {
                    startIndex = i;
                }
                openBraces++;
            } else if (char === "}") {
                openBraces--;
                if (openBraces === 0) {
                    const jsonString = dataString.slice(startIndex, i + 1);
                    try {
                        const parsed = JSON.parse(jsonString);
                        const resultParse = OpenaiResponseSchema.safeParse(parsed);
                        if (resultParse.success) {
                            result.push(resultParse.data);
                        } else {
                            console.warn("Schema 校验失败:", resultParse.error.format());
                        }
                    } catch (e) {
                        console.error("JSON 解析错误:", e);
                    }
                }
            }
        }
    }

    return result;
}