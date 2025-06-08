'use client'
import {InputBox} from "@/components/input-box/input-box";
import {ChatList} from "@/components/chat-list/chat-list";

export default function ChatPage() {
    return <div className={"h-screen max-h-screen overflow-hidden flex flex-col items-center justify-start w-screen "}>
        <ChatList/>
        <InputBox/>
    </div>
}