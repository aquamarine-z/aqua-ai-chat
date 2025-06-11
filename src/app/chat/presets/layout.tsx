"use client";
import React, {useEffect} from "react";

export default function PresetsLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    useEffect(() => {
        document.title = "Presets - Aqua AI Chat";
    }, []);
    return <div
        className={"w-full h-full max-h-screen overflow-hidden flex flex-col items-center justify-start pb-2 bg-neutral-100 dark:bg-neutral-800"}>
        {children}
    </div>
}