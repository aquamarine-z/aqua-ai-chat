import {ChatMessage} from "@/schema/chat-message";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {motion} from "framer-motion";
import React, {useEffect} from "react";
import {cn} from "@/lib/utils";
import {useLanguageStore} from "@/store/language-store";
import {MarkdownRenderer} from "@/components/markdown";

export interface ThinkingProps {
    message: ChatMessage;
    updateMessage?: (action: React.SetStateAction<ChatMessage>) => void;
}

export function Thinking(props: ThinkingProps) {
    const language = useLanguageStore().language
    const thinkingOpen = props.message.thinking?.open;
    //console.log(thinkingOpen)
    useEffect(() => {
        if (thinkingOpen === undefined) {
            if (props.updateMessage) {
                //console.log("update message thinking state to open")
                props.updateMessage((prev) => ({
                    ...prev,
                    thinking: {
                        ...prev.thinking,
                        open: true
                    }
                }) as ChatMessage);
            }
        }
        //console.log(props.message.thinking)
    }, []);
    //console.log("finished", props.message.thinking?.finished)
    // @ts-ignore
    return <div className={"w-fit max-w-full"}>
        <Accordion type={"single"} className={"w-full"} collapsible defaultValue={thinkingOpen ? "item-1" : undefined}>

            <AccordionItem value={"item-1"}>
                <AccordionTrigger className={" w-full select-none hover:no-underline justify-start"} onClick={() => {
                    if (props.updateMessage) {
                        //console.log("update message thinking state")
                        props.updateMessage((prev) => ({
                            ...prev,
                            thinking: {
                                ...prev.thinking,
                                open: !thinkingOpen
                            }
                        }) as ChatMessage);
                    }
                }}>
                    <span
                        className={cn("select-none text-foreground/60 font-semibold hover:text-foreground/80 transition hover:cursor-pointer")}>

                        {// @ts-ignore
                            language["chat-fragment.thinking.thinking-title"](props.message.thinking?.startTime || Date.now(), props.message.thinking?.finishTime || Date.now(), props.message.thinking?.finished)
                        }
                    </span>

                </AccordionTrigger>
                <AccordionContent className={"border-x-2 border-foreground/20 px-3 py-3 break-words "}>
                    <motion.div
                        className={"break-words"}
                    >
                        <MarkdownRenderer content={props.message.thinking!.content}/>
                    </motion.div>
                </AccordionContent>

            </AccordionItem>
        </Accordion>

    </div>
}