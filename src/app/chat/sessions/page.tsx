'use client'
import {InputBox} from "@/components/input-box/input-box";
import {ChatList} from "@/components/chat-list/chat-list";

export default function ChatSessionPage() {
    return <div className={"h-screen w-full max-h-screen overflow-hidden flex flex-col items-center justify-start "}>
        <ChatList/>
        <InputBox/>
    </div>
}