import {z} from "zod";
import {ChatMessage, ChatMessageContentSchema, defaultGreetingMessage} from "@/schema/chat-message";
import {defaultModelConfig, ModelConfigSchema} from "@/schema/model-config";
import {defaultInputStorage, InputStorageSchema} from "@/schema/input-storage";
import {SetStateAction} from "react";
import {applySetStateAction} from "@/utils";


export const ChatSessionSchema = z.object({
    messages: z.array(ChatMessageContentSchema),
    modelConfig: ModelConfigSchema,
    name: z.string(),
    streaming: z.boolean().nullable().optional(),
    inputStorage: InputStorageSchema,
})
export type ChatSession = z.infer<typeof ChatSessionSchema>
export const defaultChatSession: ChatSession = {
    messages: [defaultGreetingMessage],
    modelConfig: defaultModelConfig,
    name: "New Conversation",
    streaming: false,
    inputStorage: defaultInputStorage,

}