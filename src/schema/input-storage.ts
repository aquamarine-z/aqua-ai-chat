import {z} from "zod"
export const InputStorageSchema=z.object({
    text: z.string().default(""),
})
export type InputStorage = z.infer<typeof InputStorageSchema>
export const defaultInputStorage: InputStorage = {
    text: "",
}