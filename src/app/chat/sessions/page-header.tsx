'use client'
import {Button} from "@/components/ui/button";
import {useChatStore} from "@/store/chat-store";
import {defaultChatSession} from "@/schema/chat-session";
import {SessionSelector} from "@/components/session-selector";
import {useLanguageStore} from "@/store/language-store";
import logoBlack from "@/../public/logo/logo-black.svg"
import Image from 'next/image'
import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar";


export function PageHeader() {
    const chatStore = useChatStore()
    const language = useLanguageStore().language
    const {open, setOpen} = useSidebar()
    return <div
        className={"w-full h-12 sticky top-0 left-0 bg-gradient-to-b from-neutral-100 via-neutral-100 via-80% to-transparent z-40 dark:from-neutral-800 dark:via-neutral-800"}>
        <div className={"w-full h-full flex flex-row px-4 items-center"}>
            <SidebarTrigger className={"sm:hidden w-6 h-6 "} variant={"ghost"} onClick={()=>{
                setOpen(!open)
            }}/>
            <Button className={"h-2/3 w-fit flex items-center text-sm flex-row gap-2"} variant={"ghost"}
                    onClick={() => {
                        chatStore.setChatStore(prev => {
                            return {
                                ...prev,
                                sessions: prev.sessions?.concat(defaultChatSession),
                                currentSessionIndex: prev.sessions?.length,
                            }
                        })
                    }}>
                <Image src={logoBlack} alt={""} className={"w-6 h-6 dark:invert"}/>
                <p className={"text-sm flex items-center justify-center"}>{language["page-header.title"]}</p>
            </Button>
            <div className={"grow"}/>
            <SessionSelector/>
        </div>
    </div>
}