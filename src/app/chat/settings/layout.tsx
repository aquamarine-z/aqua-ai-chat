"use client";
import React, {useEffect} from "react";
import {PathDisplayer} from "@/app/chat/settings/path-displayer";
import SettingsSidebar from "@/app/chat/settings/settings-sidebar";

export default function SettingsLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        document.title = "Settings - Aqua AI Chat";
    }, []);
    return <div
        className={"h-screen w-full max-h-screen overflow-hidden flex flex-row items-center justify-start  bg-neutral-100 dark:bg-neutral-800"}>
        <div className={"h-full w-48"}>
            <SettingsSidebar/>
        </div>
        <div className={"w-full h-full flex flex-col items-center justify-start"}>
            <PathDisplayer/>
            <div className={"w-full grow"}>
                {children}
            </div>
        </div>
        {children}
    </div>
}