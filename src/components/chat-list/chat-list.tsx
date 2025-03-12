import {useChatStore} from "@/store/chat-store";
import {ChatFragment} from "@/components/chat-list/chat-fragment";

import {applySetStateAction} from "@/utils";

export function ChatList() {
    const chatStore = useChatStore()
    return <div className={"w-full h-full px-4 p-2 "}>
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