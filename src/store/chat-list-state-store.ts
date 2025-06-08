'use client'
import {create} from "zustand/react";

interface ChatListState {
    scrollToBottom: () => void,
    isAtBottom: boolean,
    setAtBottom: (value: boolean) => void,
    setScrollToBottom: (scrollToBottom: () => void) => void,
}

export const useChatListStateStore = create<ChatListState>((set, get) => ({

    scrollToBottom: () => {

    },
    isAtBottom: true,
    setAtBottom: (value) => {
        set(prev => ({...prev, isAtBottom: value}))
    },
    setScrollToBottom: (scrollToBottom: () => void) => {
        set(prev => ({...prev, scrollToBottom}))
    }
}))
