import {create} from 'zustand'
import {persist} from "zustand/middleware";
import {SetStateAction} from "react";
import {applySetStateAction} from "@/utils";

// 定义 SettingsStore 的类型
interface SettingsStore {
    "auto-generate-session-name": boolean; // 示例设置项
    setProperty: (action: SetStateAction<Partial<SettingsStore>>) => void
}

// 创建持久化的设置存储
const useSettingsStore = create(
    persist<SettingsStore>(
        (set, get) => ({
            "auto-generate-session-name": true, // 初始值
            setProperty: (action) => {
                set(applySetStateAction(get(), action))
            },
        }),
        {name: "settings"} // 持久化存储的名称
    )
);

export default useSettingsStore;