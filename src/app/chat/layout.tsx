import React from "react";
import {PageHeader} from "@/components/page-header";

export default function ChatPageLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <body className={"bg-blue-50 min-h-[100vh] w-full"}>
            <PageHeader/>
            {children}
            
        </body>
       


    );
}