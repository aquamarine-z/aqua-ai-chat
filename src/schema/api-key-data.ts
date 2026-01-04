import {z} from "zod";

export const ApiKeyDataScheme = z.object({
    url: z.string(),
    key: z.string(),
    name: z.string(),
    type: z.enum(["OpenAi", "Other", "Fake"]),
});
export type ApiKeyData = z.infer<typeof ApiKeyDataScheme>;