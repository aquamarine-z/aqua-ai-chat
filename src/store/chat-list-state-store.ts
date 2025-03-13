import {create} from "zustand/react";
import {SetStateAction} from "react";
import {applySetStateAction} from "@/utils";

interface ChatListState {
    chatListElement?: HTMLDivElement;
    setChatListElement: (action: SetStateAction<HTMLDivElement | undefined>) => void;
    scrollToBottom: () => void,
    isAtBottom: () => boolean,
    scrollToBottomWithClientHeight: () => void,
}

export const useChatListStateStore = create<ChatListState>((set, get) => ({

    chatListElement: undefined,
    setChatListElement: (action) => {
        set(prev => {
            return {...prev, chatListElement: applySetStateAction(get().chatListElement, action)};
        });
    },
    scrollToBottom: () => {
        window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
    },
    isAtBottom: () => {
        return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
    },
    scrollToBottomWithClientHeight: () => {
        // 获取页面总高度


        // 将页面滚动到底部
        setTimeout(() => {
            const pageHeight = document.body.scrollHeight;

            // 获取视口高度
            const viewportHeight = window.innerHeight;

            // 计算滚动到底部所需的距离
            const scrollToBottomDistance = pageHeight - viewportHeight;
            window.scrollTo({top: scrollToBottomDistance, behavior: 'smooth'});

            
        }, 200)


        // 等待滚动到底部完成后，向上滚动一个视口高度

    }
}))
