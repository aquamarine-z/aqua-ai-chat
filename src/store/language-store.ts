import {Language} from "@/locales";
import {create} from "zustand/react";
import {zh_cn} from "@/locales/zh_cn";
import {en} from "@/locales/en";
import {jp} from "@/locales/jp"

interface LanguageStore {
    language: Language
    name: string,
    fullName: string,
    setLanguageByName: (name: string) => void
   
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
    language: zh_cn,
    name: "zh_cn",
    setLanguageByName: (name) => {
        if (name === "zh_cn") {
            set({name: "zh_cn", language: zh_cn, fullName: "简体中文"});
        } else if (name === "en") {
            set({name: "en", language: en, fullName: "English"});
        } else if (name === "jp") {
            set({name: "jp", language: jp, fullName: "日本語"});
        } else {
            set({name: "zh_cn", language: zh_cn, fullName: "简体中文"});
        }
    },
    fullName: "简体中文"
    
}))