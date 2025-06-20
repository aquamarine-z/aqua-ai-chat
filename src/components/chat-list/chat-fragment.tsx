'use client'
import {ChatMessage} from "@/schema/chat-message";
import {memo, SetStateAction} from "react";
import {cn} from "@/lib/utils";
import {Thinking} from "@/components/chat-list/thinking";
import {CopyIcon, RefreshCcw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {ChatFragmentAction} from "@/components/chat-list/chat-fragment-action";
import {useLanguageStore} from "@/store/language-store";
import {isEqual} from "lodash";
import {ChatSession} from "@/schema/chat-session";
import {useChatStore} from "@/store/chat-store";
import {Suggestion} from "@/components/chat-list/suggestions";
import {useInputStore} from "@/store/input-store";
import 'katex/dist/katex.min.css'
import {MarkdownRenderer} from "@/components/markdown";
import {toast} from "sonner";

export interface ChatFragmentProps {
    message: ChatMessage,
    session: ChatSession,
    messageIndex: number,
    updateMessage?: (action: SetStateAction<ChatMessage>) => void,
}
export const ChatFragment = memo(
    function ChatFragment(props: ChatFragmentProps) {
        const language = useLanguageStore().language;
        const inputStore = useInputStore()
        const streaming = useChatStore(state => {
            return state.getCurrentSession().streaming
        })
        return (
            <div key={props.messageIndex} className={"my-3 w-full h-fit flex flex-col gap-6"}>
                <div className={cn("flex flex-row", props.message.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={"max-w-[90%] w-fit h-full flex flex-col break-words gap-2"}>
                        {props.message.thinking && (
                            <div className={"w-full max-w-full h-fit rounded-lg px-3 py-3 break-words"}>
                                <Thinking message={props.message} updateMessage={props.updateMessage}/>
                            </div>
                        )}

                        <div
                            className={cn("w-fit h-fit max-w-full rounded-lg px-3 py-3 break-words ", props.message.role === "user" ? " bg-background border-foreground/10 border-[1px]" : "")}>
                            {props.message.contents.map((it, index) =>
                                typeof it === "string" ? <MarkdownRenderer content={it} key={index}/> : <></>
                            )}
                        </div>
                        {
                            props.message.suggestion && <Suggestion message={props.message}>

                            </Suggestion>
                        }
                        {
                            props.message.metaType !== "greeting" && <div
                                className={cn("w-full flex gap-1", props.message.role === "user" ? "flex-row-reverse" : "flex-row")}>
                                <ChatFragmentAction
                                    trigger={
                                        <Button onClick={() => {
                                            const text = props.message.contents.join("\n");
                                            if (navigator.clipboard && text) {
                                                navigator.clipboard.writeText(text).then(() => {
                                                    toast.success(language["chat-fragment.actions.copy.success"]);
                                                }).catch(err => {
                                                    toast.error(language["chat-fragment.actions.copy.fail"]);
                                                });
                                            }

                                        }} disabled={props.message.streaming || false} className={"h-8 w-8"}
                                                variant={"ghost"}>
                                            <CopyIcon/>
                                        </Button>
                                    }
                                    hover={<>{language["chat-fragment.actions.copy"]}</>}
                                />
                                {props.message.role !== "user" && (
                                    <ChatFragmentAction
                                        trigger={
                                            <Button className={"h-8 w-8"} variant={"ghost"}
                                                    disabled={streaming || false}
                                                    onClick={() => {
                                                        //获取以此index起始的上一条消息用户的内容
                                                        const lastUserMessage = props.session.messages.slice(0, props.messageIndex).reverse().find(msg => msg.role === "user");
                                                        inputStore.chat?.({...lastUserMessage} as ChatMessage)
                                                    }}>
                                                <RefreshCcw/>
                                            </Button>
                                        }
                                        hover={<>{language["chat-fragment.actions.retry"]}</>}
                                    />
                                )}
                            </div>
                        }

                    </div>
                </div>
            </div>
        );
    },
    (prevProps: { message: any }, nextProps: { message: any }) => {
        //console.log("Comparing messages", prevProps.message, nextProps.message);
        return isEqual(prevProps.message, nextProps.message)
    }
);
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
