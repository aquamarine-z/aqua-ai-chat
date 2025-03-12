import {z} from "zod";

export const models = [
    {
        name: "Deepseek R1"
    },
    {
        name: "Kimi 1.5"
    },
    {
        name: "Deepseek R1 32b"
    }
]
export const ModelConfigSchema = z.object({
    name: z.string()
})
export type ModelConfig=z.infer<typeof ModelConfigSchema>
export const defaultModelConfig = models[0]