import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {ApiKeyData} from "@/schema/api-key-data";



type ApiKeyStore = {
    keys: Record<string, ApiKeyData>;
    getKey: (name: string) => ApiKeyData | undefined;
    setKey: (name: string, data: ApiKeyData) => void;
    clearKeys: () => void;
    removeKey: (name: string) => void;
    reset: () => void;
};
const initialState = {
    keys: {
        "Deepseek R1": {
            url: "https://api.deepseek.com/v1/chat/completions",
            key: "",
            name: "Deepseek R1",
            type: "OpenAi" as "OpenAi",
        },
        "Car Assistant": {
            url: "",
            key: "",
            name: "Car Assistant",
            type: "Fake" as "Fake",
        }
    },
}
export const useApiKeyStore = create<ApiKeyStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            getKey: (name: string) => {
                return get().keys[name];
            },

            setKey: (name: string, data: ApiKeyData) => {
                set((state) => ({
                    keys: {
                        ...state.keys,
                        [name]: data,
                    },
                }));
            },

            clearKeys: () => {
                set({keys: {}});
            },

            removeKey: (name: string) => {
                set((state) => {
                    const newKeys = {...state.keys};
                    delete newKeys[name];
                    return {keys: newKeys};
                });
            },
            reset: () => {
                set(initialState);
            },
        }),
        {
            name: 'api-key-store',
        }
    )
);
