
import {ModelConfig} from "@/schema/model-config";
import {ChatSession} from "@/schema/chat-session";
import {DeepseekApi} from "@/api/deepseek-api";
import {SetStateAction} from "react";
export class ChatConfig{
    session: ChatSession | undefined
    onFinish?: () => void;
}
export interface ChatApi {
    sendMessage:(config:ChatConfig,updater:(action:SetStateAction<ChatSession>)=>void)=>void
    stop:()=>void,
}
export function getApiByModelName(model:ModelConfig){
    if(model.name.startsWith("Deepseek")){
        return new DeepseekApi()
    }
}