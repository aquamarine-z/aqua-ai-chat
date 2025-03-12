'use client'
import {ChatApi, ChatConfig} from "@/api/index";
import {SetStateAction} from "react";
import {ChatSession} from "@/schema/chat-session";
import {ChatMessage} from "@/schema/chat-message";


export class DeepseekApi implements ChatApi {
    stopStream = false;

    sendMessage(config: ChatConfig, updater: (action: SetStateAction<ChatSession>) => void) {
        const botMessage: ChatMessage = {
            role: "assistant",
            contents: [""],
            streaming: true,
        }
        updater(prev => {
            return {
                ...prev,
                messages: [...prev.messages, botMessage],
                streaming: true,
            }
        })
        this.stopStream = false
        const userMessage = config.session?.messages[config.session?.messages.length - 1]
        let i = 0
        const inter = setInterval(() => {
            botMessage.contents[0] += i
            updater(prev => {
                return {
                    ...prev,
                    messages: prev.messages.concat()
                }
            })
            i++
            if (i > 40) {
                updater(prev => {
                    return {
                        ...prev,
                        streaming: false,
                    }
                })
                clearInterval(inter)
            }
            if (this.stopStream) {
                updater(prev => {
                    return {
                        ...prev,
                        streaming: false,
                    }
                })
                clearInterval(inter)
            }
        }, 500)

    }

    stop(): void {
        this.stopStream = true
    }
}