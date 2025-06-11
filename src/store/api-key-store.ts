import {create} from 'zustand';
import {persist} from 'zustand/middleware';

type ApiKeyData = {
    url: string;
    key: string;
};

type ApiKeyStore = {
    keys: Record<string, ApiKeyData>;
    getKey: (name: string) => ApiKeyData | undefined;
    setKey: (name: string, url: string, key: string) => void;
    clearKeys: () => void;
    removeKey: (name: string) => void;
};

export const useApiKeyStore = create<ApiKeyStore>()(
    persist(
        (set, get) => ({
            keys: {},

            getKey: (name: string) => {
                return get().keys[name];
            },

            setKey: (name: string, url: string, key: string) => {
                set((state) => ({
                    keys: {
                        ...state.keys,
                        [name]: {url, key},
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
