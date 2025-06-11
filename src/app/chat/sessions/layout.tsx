'use client'
import React, {useEffect} from "react";
import {PageHeader} from "./page-header";
import {useChatStore} from "@/store/chat-store";

export default function SessionPageLayout({
                                              children,
                                          }: Readonly<{
    children: React.ReactNode;
}>) {
    const chatStore = useChatStore()
    const currentSession = chatStore.getCurrentSession()
    useEffect(() => {
        document.title = `${currentSession.name} - Aqua AI Chat`
    }, [currentSession.name])
    return <>
        <div
            className={"w-full h-full max-h-screen overflow-hidden flex flex-col items-center justify-start pb-2 bg-neutral-100 dark:bg-neutral-800"}>
            <PageHeader/>
            {children}
        </div>
    </>
}