import {ChatMessage} from "@/schema/chat-message";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import Markdown from "react-markdown";
import {motion} from "framer-motion";
import React from "react";

export interface ThinkingProps {
    message: ChatMessage;
}

export function Thinking(props: ThinkingProps) {
    return <div className={"w-fit max-w-full"}>
        <Accordion type={"single"} className={"w-full"} collapsible>

            <AccordionItem value={"item-1"} >
                <AccordionTrigger className={"w-full select-none hover:no-underline "}>
                    <span className={"select-none text-foreground/60 font-semibold hover:text-foreground/80 transition hover:cursor-pointer"}>
                        正在思考,用时{(Date.now() - props.message.thinking!.startTime) / 1000}秒
                    </span>
                </AccordionTrigger>
                <AccordionContent className={"border-x-2 border-foreground/20 px-3 py-3 break-words "}>
                    <motion.div
                        initial={{height: 0, opacity: 0}}
                        animate={{height: "auto", opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.3}}
                        className={"break-words"}
                    >
                        <Markdown>{props.message.thinking!.content}</Markdown>
                    </motion.div>
                </AccordionContent>

            </AccordionItem>
        </Accordion>

    </div>
}