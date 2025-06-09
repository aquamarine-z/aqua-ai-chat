'use client'
import React from "react";
import {PageHeader} from "@/components/page-header";
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";

export default function ChatPageLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div data-theme="dark" className={"w-screen h-screen"}>
            <SidebarProvider>
                <AppSidebar/>
                <div
                    className={"w-full h-full max-h-screen overflow-hidden flex flex-col items-center justify-start pb-2 bg-neutral-100 dark:bg-neutral-800"}>
                    <PageHeader/>
                    {children}
                </div>
            </SidebarProvider>

        </div>

    );
}