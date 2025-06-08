'use client'
import {useChatStore} from "@/store/chat-store";
import {ChatFragment} from "@/components/chat-list/chat-fragment";

import {applySetStateAction} from "@/utils";
import {useEffect, useRef} from "react";
import {Virtuoso} from "react-virtuoso";
import styles from "./chat-list.module.css"
import {cn} from "@/lib/utils";
import {useChatListStateStore} from "@/store/chat-list-state-store";

export function ChatList() {
    const chatStore = useChatStore()
    useEffect(() => {
        chatStore.repairCurrentSession()
    }, [chatStore.currentSessionIndex]);
    const chatListStateStore = useChatListStateStore()
    const messages = chatStore.getCurrentSession().messages
    const virtuosoRef = useRef(null)
    useEffect(() => {
        chatListStateStore.setScrollToBottom(() => {
            if (virtuosoRef.current) {
                //@ts-ignore
                virtuosoRef.current?.scrollToIndex({
                    index: Number.MAX_SAFE_INTEGER,
                    align: 'end', // 可选: 'start' | 'center' | 'end'
                    behavior: 'smooth', // 可选: 'auto' | 'smooth'
                })
            }
        })
    }, [chatStore]);
    return <Virtuoso followOutput={true}
                     className={cn("w-full h-full py-2 grow overflow-y-auto flex items-center ", styles["chat-list-scroll"])}
                     data={messages}
                     overscan={250}
                     atBottomStateChange={(atBottom) => {
                         chatListStateStore.setAtBottom(atBottom)
                     }}
                     ref={virtuosoRef}
                     initialTopMostItemIndex={messages.length - 1}
                     itemContent={(index, item) => {
                         return <div className={"px-10 w-full flex items-center justify-center"}>
                             <div className={"max-w-5xl w-full"}>
                                 <ChatFragment
                                     message={{...item, contents: [...item.contents]}} key={index}
                                     messageIndex={index}
                                     session={chatStore.getCurrentSession()}

                                     updateMessage={(action) => {
                                         const newMessage = applySetStateAction(item, action)
                                         chatStore.updateCurrentSession(prev => {
                                             const messages = prev.messages
                                             messages[index] = newMessage
                                             return {
                                                 ...prev,
                                                 messages: messages,
                                             }
                                         })
                                     }}/>
                             </div>

                         </div>
                     }}
    >

    </Virtuoso>
}