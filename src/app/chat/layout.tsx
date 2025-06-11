'use client'
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";


export default function ChatPageLayout({
                                           children,
                                       }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div data-theme="dark" className={"w-screen h-screen"}>
                <SidebarProvider defaultOpen={true}>
                    <AppSidebar/>
                    {children}
                </SidebarProvider>

            </div>
        </>


    );
}
