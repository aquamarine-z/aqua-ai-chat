'use client'
import React, {useEffect} from "react";
import {PageHeader} from "@/components/page-header";
import {SidebarProvider, useSidebar} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {useChatStore} from "@/store/chat-store";


export default function ChatPageLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    const chatStore = useChatStore()
    const currentSession = chatStore.getCurrentSession()
    useEffect(() => {
        document.title = `${currentSession.name} - Aqua AI Chat`
    }, [currentSession.name])
    return (
        <>
            <div data-theme="dark" className={"w-screen h-screen"}>
                <SidebarProvider defaultOpen={true}>
                    <AppSidebar />
                    <div
                        className={"w-full h-full max-h-screen overflow-hidden flex flex-col items-center justify-start pb-2 bg-neutral-100 dark:bg-neutral-800"}>
                        <PageHeader/>
                        {children}
                    </div>
                </SidebarProvider>

            </div>
        </>


    );
}
