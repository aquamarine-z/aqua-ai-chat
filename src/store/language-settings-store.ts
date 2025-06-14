import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export interface LanguageSettingsStore {
    languageName: string
    setLanguageName: (name: string) => boolean
    asPrompt: boolean
    setAsPrompt: (value: boolean) => void
}

export const useLanguageSettingsStore = create<LanguageSettingsStore>()(
    persist(
        (set, get) => ({
            languageName: 'zh_cn',
            setLanguageName: (name: string): boolean => {
                if (name === 'zh_cn') {
                    set({languageName: 'zh_cn'})
                } else if (name === 'en') {
                    set({languageName: 'en'})
                } else if (name === 'jp') {
                    set({languageName: 'jp'})
                } else {
                    set({languageName: 'zh_cn'})
                    return false
                }
                return true
            },
            asPrompt: false,
            setAsPrompt: (value: boolean) => {
                set({asPrompt: value})
            },
        }),
        {
            name: 'language-settings',
        }
    )
)
