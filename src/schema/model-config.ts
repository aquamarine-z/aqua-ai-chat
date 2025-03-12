import {z} from "zod";

export const ModelConfigSchema = z.object({
    name: z.string()
})
export type ModelConfig=z.infer<typeof ModelConfigSchema>
export const defaultModelConfig={
    name:"aqua-ai"
}