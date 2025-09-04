import {ChatApi, ChatConfig} from "@/api/index";
import React from "react";
import {ChatSession} from "@/schema/chat-session";
import {ChatMessage} from "@/schema/chat-message";

export class CarAssistantApi implements ChatApi{
    stopStream = false;
    query(messages: ChatMessage[]): Promise<string> {
        return Promise.resolve("");
    }

    sendMessage(config: ChatConfig, updater: (action: React.SetStateAction<ChatSession>) => void): void {

    }

    stop(): void {
        this.stopStream = true;
    }

}