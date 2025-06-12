import {ModelConfig} from "@/schema/model-config";
import {ChatSession} from "@/schema/chat-session";
import {DeepseekApi} from "@/api/deepseek-api";
import {SetStateAction} from "react";
import {FakeServerApi} from "@/api/fake-server-api";
import {ChatMessage} from "@/schema/chat-message";
import {useLanguageStore} from "@/store/language-store";
import {useLanguageSettingsStore} from "@/store/language-settings-store";
import {DeepseekApiAgent} from "@/api/deepseek-api-agent";

export class ChatConfig{
    session: ChatSession | undefined
    onFinish?: () => void;
    messageIndex?:number;
    userMessage?: ChatMessage;
    
}
export interface ChatApi {
    sendMessage:(config:ChatConfig,updater:(action:SetStateAction<ChatSession>)=>void)=>void,
    query:(messages:ChatMessage[])=>Promise<string>,
    stop:()=>void,
}
export function getApiByModelName(model:ModelConfig){
    if(model.name.startsWith("Deepseek")){
        return new DeepseekApiAgent()
    }else if(model.name.startsWith("Car Assistant")) {
        return new FakeServerApi()
    }
}

export function generateSystemMessage(): ChatMessage[] {
    const result: ChatMessage[] = [] as ChatMessage[]
    const languageStore = useLanguageSettingsStore.getState().asPrompt
    if (languageStore) {
        const languageName = useLanguageStore.getState().fullName
        result.push({
            role: "system",
            contents: [`The user mainly use the local language named ${languageName}, if the user doesn't say what language he want to use, just use the local language to answer`]
        } as ChatMessage)
    }
    //console.log(result)
    return result
}