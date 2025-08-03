import {useChatStore} from "@/store/chat-store";
import {useLanguageSettingsStore} from "@/store/language-settings-store";
import {useSettingsStore} from "@/store/settings-store";
import {useApiKeyStore} from "@/store/api-key-store";

export const stores={
    resetAllStores: () => {
        useChatStore.getState().reset()
        useLanguageSettingsStore.getState().reset()
        useSettingsStore.getState().reset()
        useApiKeyStore.getState().reset()
    }
}