'use client'
import {ChatMessage} from "@/schema/chat-message";
import {SetStateAction} from "react";
import Markdown from "react-markdown";
import {cn} from "@/lib/utils";
import {Thinking} from "@/components/chat-list/thinking";
import {CopyIcon, RefreshCcw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ChatFragmentAction} from "@/components/chat-list/chat-fragment-action";
import {useLanguageStore} from "@/store/language-store";

export interface ChatFragmentProps {
    message: ChatMessage,
    messageIndex: number,
    updateMessage?: (action: SetStateAction<ChatMessage>) => void,
    actions?: {
        onRetry?: () => void
    }
}

export function ChatFragment(props: ChatFragmentProps) {
    const language = useLanguageStore().language
    //const inputStore = useInputStore();
    return <div key={props.messageIndex} className={"my-3 w-full h-fit flex flex-col gap-6"}>
        <div className={cn("flex flex-row", props.message.role === "user" ? "justify-end" : "justify-start")}>
            <div className={"max-w-[90%] w-fit h-full flex flex-col  break-words gap-2"}>
                {props.message.thinking &&
                    <div className={"w-full max-w-full h-fit rounded-lg px-3 py-3 break-words "}>
                        <Thinking message={props.message}/>
                    </div>}
            
            <div className={cn("w-fit h-fit max-w-full rounded-lg px-3 py-3 break-words ",props.message.role==="user"?" bg-background":"")}>
                {props.message.contents.map((it,index)=>{
                    if (typeof it === "string") return <>
                        <Markdown key={index}>{it}</Markdown>

                    </>
                    else return <></>
                })}
                {props.message.streaming && <DotsLoading/>}
            </div>
                <div
                    className={cn("w-full flex gap-1", props.message.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <ChatFragmentAction trigger={
                        <Button
                            className={"h-8 w-8"}
                            variant={"ghost"}
                            onClick={() => {
                            }}>
                            <CopyIcon/>
                        </Button>
                    }
                                        hover={<>{language["chat-fragment.actions.copy"]}</>}

                    />
                    {props.message.role !== 'user' && <ChatFragmentAction trigger={
                        <Button
                            className={"h-8 w-8"}
                            variant={"ghost"}
                            onClick={() => {
                                props.actions?.onRetry?.()
                            }}>
                            <RefreshCcw/>
                        </Button>
                    }
                                                                          hover={<>{language["chat-fragment.actions.retry"]}</>}

                    />
                    }

                </div>
            </div>

        </div>
    </div>
}

function DotsLoading() {
    return (
        <svg width="50" height="20" viewBox="0 0 50 20" className={"fill-foreground py-1 px-0"}>
            <circle cx="10" cy="10" r="5" fill="var(--foreground)">
                <animate
                    attributeName="cy"
                    values="10;5;10"
                    dur="0.5s"
                    repeatCount="indefinite"
                    begin="0s"
                />
            </circle>
            <circle cx="25" cy="10" r="5" fill="var(--foreground)">
                <animate
                    attributeName="cy"
                    values="10;5;10"
                    dur="0.5s"
                    repeatCount="indefinite"
                    begin="0.2s"
                />
            </circle>
            <circle cx="40" cy="10" r="5" fill="var(--foreground)">
                <animate
                    attributeName="cy"
                    values="10;5;10"
                    dur="0.5s"
                    repeatCount="indefinite"
                    begin="0.4s"
                />
            </circle>
        </svg>
    );
}
