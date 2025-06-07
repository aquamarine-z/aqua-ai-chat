import React from "react";
import {PageHeader} from "@/components/page-header";

export default function ChatPageLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={"w-screen h-screen max-h-screen overflow-hidden flex flex-col items-center justify-start pb-2"}>
            <PageHeader/>
            {children}
        </div>
    );
}