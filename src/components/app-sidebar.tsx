import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,} from "@/components/ui/sidebar"
import {ThemeToggle} from "@/components/theme-toggle";
import {useAppInformationStore} from "@/store/app-information-store";
import logoBlack from "@/../public/logo/logo-black.svg"
import Image from "next/image";
import {Button} from "./ui/button";

import {cn} from "@/lib/utils";
import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useLanguageStore} from "@/store/language-store";
import {SaveIcon, SettingsIcon} from "lucide-react";
import {useChatStore} from "@/store/chat-store";

export function AppSidebar() {
    const appInformation = useAppInformationStore()
    const pathname = usePathname()
    const router = useRouter()
    const language = useLanguageStore().language
    useEffect(() => {
        console.log(pathname)
    }, []);
    return (
        <Sidebar className={"w-64"}>
            <SidebarHeader className={"flex flex-col items-center justify-start"}>
                <Image src={logoBlack} alt="logo" className={"w-32 h-32 dark:invert"}/>
                <h1 className={"font-extrabold"}>Aqua AI Chat</h1>
            </SidebarHeader>
            <SidebarContent className={"w-full grow flex flex-col items-center justify-start"}>
                <SidebarGroup className={"w-full h-fit px-4 "}>
                    <Button variant={pathname === "/chat/settings" ? undefined : "ghost"}
                            className={cn(" w-full h-12 flex flex-row items-center ")}
                            onClick={() => {
                                router.push("/chat/settings");
                            }}
                    >
                        <SettingsIcon className={"size-8"}/>
                        <span className={"grow text-center text-xl"}>{language["sidebar.navigator.settings"]}</span>
                    </Button>
                    <Button variant={pathname === "/chat/presets" ? undefined : "ghost"}
                            onClick={() => {
                                router.push("/chat/presets");
                            }}
                            className={cn(" w-full h-12 flex flex-row items-center ")}>
                        <SaveIcon className={"size-8"}/>
                        <span className={"grow text-center text-xl"}>{language["sidebar.navigator.presets"]}</span>
                    </Button>
                </SidebarGroup>
                <ChatSessionList/>
            </SidebarContent>
            <SidebarFooter>
                <div className={"w-full h-full items-center flex justify-start px-4"}>
                    <p className={"text-md"}>{appInformation.version} {appInformation.name}</p>
                    <div className={"grow"}/>
                    <ThemeToggle/>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

function ChatSessionList() {
    const pathname = usePathname()
    const language = useLanguageStore().language
    const chatStore = useChatStore()
    const router = useRouter()
    return <SidebarContent className={"w-full h-fit px-4 flex flex-col items-center justify-start grow my-10"}>
        <h1 className={"text-foreground/70"}>{language["sidebar.chat-list.title"]}</h1>
        <div className={"w-full grow overflow-hidden rounded-xl border-[1px] border-foreground/20  drop-shadow-2xl "}>
            <div
                className={"w-full h-full overflow-y-auto p-2 flex flex-col items-center justify-start rounded-xl "}>
                {chatStore.sessions.map((session, index) => {
                    return <Button className={"w-full h-12 text-lg"} onClick={() => {
                        chatStore.setChatStore(prev => {
                            return {
                                ...prev,
                                currentSessionIndex: index,
                            }
                        })
                        if (pathname !== "/chat/sessions") {
                            router.push("/chat/sessions");
                        }
                    }} key={index}
                                   variant={(pathname === "/chat/sessions" && chatStore.currentSessionIndex === index) ? "default" : "ghost"}>
                        {session.name}
                    </Button>
                })}
            </div>
        </div>

    </SidebarContent>
}