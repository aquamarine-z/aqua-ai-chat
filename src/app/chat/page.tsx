'use client'
import {InputBox} from "@/components/input-box/input-box";
import {ChatList} from "@/components/chat-list/chat-list";
import {useEffect, useRef} from "react";
import {useInputBoxStateStore} from "@/store/input-box-state-store";

export default function ChatPage() {
    const inputBoxRef = useRef(null)
    const inputBoxState = useInputBoxStateStore()
    useEffect(() => {
        inputBoxState.setInputBoxStateStore(prevState => ({...prevState, inputBoxRef}))
    }, []);
    return <div className={"h-screen max-h-screen overflow-hidden flex flex-col items-center justify-start w-screen "}>
        <ChatList/>
        <InputBox/>
    </div>
}