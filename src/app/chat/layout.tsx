import React from "react";
import {PageHeader} from "@/components/page-header";

export default function ChatPageLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className={"relative w-full h-[100vh] bg-pink-50/40"}>
            <PageHeader/>
            {children}
        </div>


    );
}