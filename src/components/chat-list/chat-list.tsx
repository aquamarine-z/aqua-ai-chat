'use client'
import {useChatStore} from "@/store/chat-store";
import {ChatFragment} from "@/components/chat-list/chat-fragment";

import {applySetStateAction} from "@/utils";
import {useChatListStateStore} from "@/store/chat-list-state-store";
import {useEffect} from "react";
import {useInputBoxStateStore} from "@/store/input-box-state-store";
import {Virtuoso} from "react-virtuoso";

export function ChatList() {
    const chatStore = useChatStore()
    const chatListStateStore = useChatListStateStore()
    const inputBoxStateStore = useInputBoxStateStore();
    useEffect(() => {
        chatListStateStore.setAtBottom(true)
        window.scrollTo({top: document.body.scrollHeight, behavior: "auto"})
    }, [chatStore.currentSessionIndex])
    useEffect(() => {
        chatStore.repairCurrentSession()
    }, [chatStore.currentSessionIndex]);
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
    }, [chatStore.currentSessionIndex]);
    const messages = chatStore.getCurrentSession().messages
    return <Virtuoso followOutput={true} className={"w-full h-full py-2 grow overflow-y-auto flex items-center "}
                     data={messages}
                     overscan={500}
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