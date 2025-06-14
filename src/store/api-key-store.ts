import {create} from 'zustand';
import {persist} from 'zustand/middleware';

type ApiKeyData = {
    url: string;
    key: string;
};

type ApiKeyStore = {
    keys: Record<string, ApiKeyData>;
    getKey: (name: string) => ApiKeyData | undefined;
    setKey: (name: string, data: ApiKeyData) => void;
    clearKeys: () => void;
    removeKey: (name: string) => void;
};

export const useApiKeyStore = create<ApiKeyStore>()(
    persist(
        (set, get) => ({
            keys: {
                "Deepseek R1": {
                    url: "https://api.deepseek.com/v1/chat/completions",
                    key: "",
                },
            },

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
        }),
        {
            name: 'api-key-store',
        }
    )
);
