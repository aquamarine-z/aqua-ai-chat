import {ChatApi, ChatConfig} from "@/api/index";
import React from "react";
import {ChatSession} from "@/schema/chat-session";
import {ChatMessage} from "@/schema/chat-message";
import {Thinking} from "@/schema/chat-message-metadata/thinking";

const responseMessageContent = `你好 这是测试数据111111111111111111111111111`
const responseThinkingContent = `你好 这是测试思考数据111111111111111111111111111`
const deltaTime = 100 // 每个字的间隔时间，单位毫秒

export class FakeServerApi implements ChatApi {
    stopStream = false;
    sendMessage(config: ChatConfig, updater: (action: React.SetStateAction<ChatSession>) => void): void {
        const botMessage: ChatMessage = {
            role: "assistant",
            contents: [""],
            streaming: true,
            thinking: {startTime: Date.now(), content: "", finished: false} as Thinking
        }
        this.stopStream = false
        //这是一个假服务器用于测试 现在需要按delta每个字地返回responseMessageContent和responseThinkingContent
        botMessage.thinking = {startTime: Date.now(), content: "", finished: false} as Thinking
        updater(prev => {
            return {
                ...prev,
                messages: [...prev.messages, botMessage],
                streaming: true,
            }
        })
        for (let i = 0; i < responseThinkingContent.length; i++) {
            setTimeout(() => {
                if (this.stopStream) {
                    return
                }
                console.log(botMessage)
                botMessage.thinking!.content += responseThinkingContent[i]

                if (i >= responseThinkingContent.length - 1) {
                    botMessage.thinking!.finishTime = Date.now()
                    botMessage.thinking!.finished = true
                }
                botMessage.thinking = {...botMessage.thinking!}
                updater(prev => {
                    return {
                        ...prev,
                        messages: prev.messages.concat()
                    }
                })
            }, i * deltaTime)
        }
        for (let i = 0; i < responseMessageContent.length; i++) {
            setTimeout(() => {
                if (this.stopStream) {
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
        }

    }

    stop(): void {
        // 停止流式传输
        this.stopStream = true;
    }

}