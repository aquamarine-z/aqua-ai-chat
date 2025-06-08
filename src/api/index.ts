
import {ModelConfig} from "@/schema/model-config";
import {ChatSession} from "@/schema/chat-session";
import {DeepseekApi} from "@/api/deepseek-api";
import {SetStateAction} from "react";
import {FakeServerApi} from "@/api/fake-server-api";
import {ChatMessage} from "@/schema/chat-message";
export class ChatConfig{
    session: ChatSession | undefined
    onFinish?: () => void;
    messageIndex?:number;
    userMessage?: ChatMessage;
}
export interface ChatApi {
    sendMessage:(config:ChatConfig,updater:(action:SetStateAction<ChatSession>)=>void)=>void
    stop:()=>void,
}
export function getApiByModelName(model:ModelConfig){
    if(model.name.startsWith("Deepseek")){
        return new DeepseekApi()
    }else if(model.name.startsWith("Car Assistant")) {
        return new FakeServerApi()
    }
}