'use client'
import {Button} from "@/components/ui/button";
import {useChatStore} from "@/store/chat-store";
import {defaultChatSession} from "@/schema/chat-session";
import {SessionSelector} from "@/components/session-selector";
import {useLanguageStore} from "@/store/language-store";
import LogoBlack from "@/../public/logo/logo-black.svg"
import Image from 'next/image'

export function PageHeader() {
    const chatStore = useChatStore()
    const language = useLanguageStore().language

    return <div
        className={"w-full h-12 sticky top-0 left-0 bg-gradient-to-b from-electric-violet-50 via-electric-violet-50 via-80% to-transparent z-40"}>
        <div className={"w-full h-full flex flex-row px-4 items-center"}>
            
            <Button className={"h-2/3 w-fit hidden sm:flex items-center text-sm flex-row gap-2"} variant={"ghost"}
                    onClick={() => {
                        chatStore.setChatStore(prev => {
                            return {
                                ...prev,
                                sessions: prev.sessions?.concat(defaultChatSession),
                                currentSessionIndex: prev.sessions?.length,
                            }
                        })
                    }}>
                <Image src={LogoBlack} alt={""} className={"w-6 h-6 "}/>
                <p className={"text-sm flex items-center justify-center"}>{language["page-header.title"]}</p>
            </Button>
            <div className={"grow"}/>
            <SessionSelector/>
        </div>
    </div>
}