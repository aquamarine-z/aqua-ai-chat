import {z} from "zod";
import {ApiKeyDataScheme} from "@/schema/api-key-data";
import {useApiKeyStore} from "@/store/api-key-store";
export const ModelConfigSchema = z.object({
    name: z.string(),
    apiKeyData: ApiKeyDataScheme
})
export type ModelConfig = {
    name: string,
    apiKeyData: string
}
export const defaultModelConfig = {
    name: "Deepseek R1",
    apiKeyData: useApiKeyStore.getState().keys["Deepseek R1"]
}