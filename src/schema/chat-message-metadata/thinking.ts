import {z} from "zod"
export const ThinkingSchema=z.object({
    content:z.string(),
    startTime:z.date(),
    finishTime:z.date().optional(),
    finished:z.boolean(),
})
export type Thinking=z.infer<typeof ThinkingSchema>