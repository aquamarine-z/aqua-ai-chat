'use client'
import {ChatMessage} from "@/schema/chat-message";
import {SetStateAction} from "react";
import Markdown from "react-markdown";
import {cn} from "@/lib/utils";
import {Thinking} from "@/components/chat-list/thinking";

export interface ChatFragmentProps {
    message: ChatMessage,
    messageIndex: number,
    updateMessage?: (action: SetStateAction<ChatMessage>) => void
}

export function ChatFragment(props: ChatFragmentProps) {
    return <div className={"my-3 w-full h-fit flex flex-col overflow-y-auto gap-6"}>
        <div className={cn("flex flex-row", props.message.role === "user" ? "justify-end" : "justify-start")}>
            <div className={"max-w-[90%] w-fit h-full flex flex-col  break-words gap-2"}>
                {props.message.thinking &&
                    <div className={"w-full max-w-full h-fit rounded-lg px-3 py-3 break-words "}>
                        <Thinking message={props.message}/>
                    </div>}
            
            <div className={cn("w-fit h-fit max-w-full rounded-lg px-3 py-3 break-words ",props.message.role==="user"?" bg-background":"")}>
                {props.message.contents.map((it,index)=>{
                    if(typeof it ==="string") return <Markdown key={index}>{it}</Markdown>
                    else return <></>
                })}
            </div>
            </div>

        </div>
    </div>
}