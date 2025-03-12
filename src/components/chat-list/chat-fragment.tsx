import {ChatMessage} from "@/schema/chat-message";
import {SetStateAction} from "react";
import Markdown from "react-markdown";
import {cn} from "@/lib/utils";

export interface ChatFragmentProps {
    message: ChatMessage,
    messageIndex: number,
    updateMessage?: (action: SetStateAction<ChatMessage>) => void
}

export function ChatFragment(props: ChatFragmentProps) {
    return <div className={"my-3 w-full h-fit flex flex-col overflow-y-auto gap-4"}>
        <div className={cn("flex flex-row", props.message.role === "user" ? "justify-end" : "justify-start")}>
            <div className={"w-fit h-fit max-w-full rounded-md px-2 py-4 bg-white"}>
                <Markdown>{props.message.contents[0]}</Markdown>
            </div>

        </div>
    </div>
}