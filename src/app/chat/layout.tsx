import React from "react";
import {PageHeader} from "@/components/page-header";

export default function ChatPageLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className={"relative w-full h-[100vh] bg-red-50"}>
            <PageHeader/>
            {children}
        </div>


    );
}