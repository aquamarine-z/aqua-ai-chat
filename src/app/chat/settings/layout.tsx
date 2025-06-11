"use client";
import React, {useEffect} from "react";
import {PathDisplayer} from "@/app/chat/settings/path-displayer";

export default function SettingsLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        document.title = "Settings - Aqua AI Chat";
    }, []);
    return <div
        className={"h-screen w-full max-h-screen overflow-hidden flex flex-col items-center justify-start  bg-neutral-100 dark:bg-neutral-800"}>

            <PathDisplayer/>
        <div className={"w-full grow flex flex-col items-center justify-center overflow-y-auto"}>
            <div className={"w-full max-w-5xl grow flex flex-col px-4 py-4 gap-20 "}>
        {children}
            </div>
        </div>
            

    </div>
}