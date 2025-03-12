import {create} from "zustand/react";
import {SetStateAction} from "react";
import {applySetStateAction} from "@/utils";

interface InputStore {
    content: string;
    setContent: (newContent: SetStateAction<string>) => void;
    clearStore: () => void;
}

export const useInputStore = create<InputStore>((set, get) => ({
    content: "",
    setContent: (action) => {
        set({...get(), content: applySetStateAction(get().content, action)})
    },
    clearStore: () => {
        set({...get(), content: ""})
    }
}))