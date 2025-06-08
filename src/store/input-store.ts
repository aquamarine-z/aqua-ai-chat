'use client'
import {create} from "zustand/react";
import {SetStateAction} from "react";
import {applySetStateAction} from "@/utils";
import {ChatMessage} from "@/schema/chat-message";

interface InputStore {
    chat?: (message?: ChatMessage) => void;
    updateInputStore: (action: SetStateAction<Partial<InputStore>>) => void;
}

export const useInputStore = create<InputStore>((set, get) => ({
    updateInputStore: (action) => {
        const value = applySetStateAction(get(), action)
        set({...get(), ...value})
    }
}))