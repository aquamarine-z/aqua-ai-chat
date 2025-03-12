import {z} from "zod";
import {ChatMessageContentSchema} from "@/schema/chat-message";
import {ModelConfigSchema} from "@/schema/model-config";

export const ChatSessionSchema = z.object({
    messages: z.array(ChatMessageContentSchema),
    modelConfig: ModelConfigSchema,
    name: z.string(),
})
export type ChatSession = z.infer<typeof ChatSessionSchema> 