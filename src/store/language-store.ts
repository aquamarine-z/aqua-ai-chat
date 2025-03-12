import {Language} from "@/locales";
import {create} from "zustand/react";
import {zh_cn} from "@/locales/zh_cn";

interface LanguageStore {
    language: Language
    name: string
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
    language: zh_cn,
    name: "zh_cn",
}))