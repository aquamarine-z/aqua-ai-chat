'use client'
import {useChatStore} from "@/store/chat-store";
import {ChatFragment} from "@/components/chat-list/chat-fragment";

import {applySetStateAction} from "@/utils";
import {useChatListStateStore} from "@/store/chat-list-state-store";
import {useEffect, useRef, useState} from "react";

export function ChatList() {
    const chatStore = useChatStore()
    const chatListStateStore = useChatListStateStore()
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        chatListStateStore.setChatListElement(divRef.current || undefined);
        return () => {
            chatListStateStore.setChatListElement(undefined);
        }
    }, [])
    useEffect(() => {
        chatListStateStore.setAtBottom(true)
        window.scrollTo({top: document.body.scrollHeight, behavior: "auto"})
    }, [])
    useEffect(() => {
        //console.log(chatListStateStore.autoScroll)
        if (chatListStateStore.autoScroll) {
            chatListStateStore.scrollToBottom();
        }
    }, [chatStore, chatListStateStore.autoScroll]);
    const checkWindowBottom = () => {
        const isBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.body.scrollHeight;
        if (isBottom) {
            chatListStateStore.setAtBottom(true)
        } else chatListStateStore.setAtBottom(false)
    };

    useEffect(() => {
        window.addEventListener('scroll', checkWindowBottom);
        return () => window.removeEventListener('scroll', checkWindowBottom);
    }, []);
    useEffect(() => {
        //chatStore.repairCurrentSession()
    }, [chatStore.currentSessionIndex]);
    return <div ref={divRef} className={"w-full h-full px-4 p-2 "}>
        {
           chatStore.getCurrentSession().messages.map((it, index) => <ChatFragment message={it} key={index}
                                                                                    messageIndex={index}
                                                                                    updateMessage={(action) => {
                                                                                        const newMessage = applySetStateAction(it, action)

                                                                                        chatStore.updateCurrentSession(prev => {
                                                                                            const messages = prev.messages
                                                                                            messages[index] = newMessage
                                                                                            return {
                                                                                                ...prev,
                                                                                                messages: messages,
                                                                                            }
                                                                                        })
                                                                                    }}/>)
        }
    </div>
}