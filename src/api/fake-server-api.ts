import {ChatApi, ChatConfig} from "@/api/index";
import React from "react";
import {ChatSession} from "@/schema/chat-session";
import {ChatMessage} from "@/schema/chat-message";
import {Thinking} from "@/schema/chat-message-metadata/thinking";

const responseMessageContent = `
## 表格示例

| 项目 | 数值 |
|------|------|
| A    | 100  |
| B    | 200  |

## 任务列表

- [x] 已完成
- [ ] 未完成

## 数学公式

这是行内公式：$a^2 + b^2 = c^2$。

$$
\\sum_{i=1}^n i = \\frac{n(n+1)}{2}
$$
`
const responseThinkingContent = `你好 这是测试思考数据111111111111111111111111111`
const deltaTime = 10 // 每个字的间隔时间，单位毫秒

export class FakeServerApi implements ChatApi {
    query(message:ChatMessage[]):Promise<string>{
        console.log(message)
        return new Promise<string>((resolve, reject)=>{
            resolve("null")
        })
    }
    stopStream = false;

    sendMessage(config: ChatConfig, updater: (action: React.SetStateAction<ChatSession>) => void): void {
        const botMessage: ChatMessage = {
            role: "assistant",
            contents: [""],
            streaming: true,
            thinking: {startTime: Date.now(), content: "", finished: false, open: true} as Thinking
        }
        const userMessage: ChatMessage = {
            ...config.userMessage
        } as ChatMessage
        updater(prev => {
            return {
                ...prev,
                messages: [...prev.messages, userMessage],
                streaming: true,
            }
        })
        this.stopStream = false
        //这是一个假服务器用于测试 现在需要按delta每个字地返回responseMessageContent和responseThinkingContent
        updater(prev => {
            return {
                ...prev,
                messages: [...prev.messages, botMessage],
                streaming: true,
            }
        })
        //console.log(botMessage.thinking?.finished)
        for (let i = 0; i < responseThinkingContent.length; i++) {
            ((i: number) => {
                setTimeout(() => {
                    //console.log({...botMessage.thinking})
                    if (this.stopStream) {
                        //console.log("stop")
                        if (!botMessage.thinking?.finished) {
                            botMessage.thinking!.finishTime = Date.now()
                            botMessage.thinking!.finished = true
                            botMessage.thinking = {...botMessage.thinking!}
                            console.log(botMessage)
                            updater(prev => {
                                return {
                                    ...prev,
                                    messages: prev.messages.concat()
                                }
                            })
                        }

                        return
                    }
                    //console.log({...botMessage})
                    botMessage.thinking!.content += responseThinkingContent[i]

                    if (i >= responseThinkingContent.length - 1) {
                        botMessage.thinking!.finishTime = Date.now()
                        botMessage.thinking!.finished = true
                       // console.log(1)
                    }
                    //console.log(botMessage.thinking)
                    //console.log(botMessage)
                    botMessage.thinking = {...botMessage.thinking!}
                    updater(prev => {
                        return {
                            ...prev,
                            messages: prev.messages.concat()
                        }
                    })
                }, i * deltaTime)
            })(i)

        }
        for (let i = 0; i < responseMessageContent.length; i++) {
            ((i:number)=>{
                setTimeout(() => {
                if (this.stopStream) {
                    updater(prev => {
                        return {
                            ...prev,
                            messages: prev.messages.concat()
                        }
                    })
                    return
                }
                botMessage.contents[0] += responseMessageContent[i]
                updater(prev => {
                    return {
                        ...prev,
                        messages: prev.messages.concat()
                    }
                })
                if (i >= responseMessageContent.length - 1) {
                    botMessage.streaming = false
                    updater(prev => {
                        return {
                            ...prev,
                            streaming: false,
                        }
                    })
                    if (config.onFinish) {
                        config.onFinish()
                    }
                }
            }, i * deltaTime + responseThinkingContent.length * deltaTime)
            })(i)

        }

    }

    stop(): void {
        // 停止流式传输
        this.stopStream = true;
    }

}