import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,} from "@/components/ui/sidebar"
import {ThemeToggle} from "@/components/theme-toggle";
import {useAppInformationStore} from "@/store/app-information-store";
import logoBlack from "@/../public/logo/logo-black.svg"
import Image from "next/image";
import {Button} from "./ui/button";

import {cn} from "@/lib/utils";
import {usePathname, useRouter} from "next/navigation";
import {useLanguageStore} from "@/store/language-store";
import {SaveIcon, SettingsIcon} from "lucide-react";
import {useChatStore} from "@/store/chat-store";
import {ChatSession} from "@/schema/chat-session";
import {ContextMenu, ContextMenuContent, ContextMenuTrigger} from "@/components/ui/context-menu";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";

export function AppSidebar() {
    const appInformation = useAppInformationStore()
    const pathname = usePathname()
    const router = useRouter()
    const language = useLanguageStore().language
    return (
        <Sidebar className={"w-64"}>
            <SidebarHeader className={"flex flex-col items-center justify-start"}>
                <Image src={logoBlack} alt="logo" className={"w-32 h-32 dark:invert"}/>
                <h1 className={"font-extrabold"}>Aqua AI Chat</h1>
            </SidebarHeader>
            <SidebarContent className={"w-full grow flex flex-col items-center justify-start"}>
                <SidebarGroup className={"w-full h-fit px-4 "}>
                    <Button variant={pathname.includes("/chat/settings") ? undefined : "ghost"}
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
    const language = useLanguageStore().language
    const chatStore = useChatStore()
    return <SidebarContent className={"w-full h-fit px-4 flex flex-col items-center justify-start grow my-10"}>
        <h1 className={"text-foreground/70"}>{language["sidebar.chat-list.title"]}</h1>
        <div className={"w-full grow overflow-hidden rounded-xl border-[1px] border-foreground/20  drop-shadow-2xl "}>
            <div
                className={"w-full h-full overflow-y-auto p-2 flex flex-col items-center justify-start rounded-xl overflow-x-hidden"}>
                {chatStore.sessions.map((session, index) => {
                    return <ChatSessionListItem key={index} session={session} index={index}/>
                })}
            </div>
        </div>

    </SidebarContent>
}

function ChatSessionListItem({session, index}: { session: ChatSession; index: number }) {
    const pathname = usePathname();
    const chatStore = useChatStore();
    const router = useRouter();

    return (
        <ContextMenu onOpenChange={(open) => {
            if (open) {
                //如果是手机端 则添加震动效果
                if (typeof window !== "undefined" && "vibrate" in navigator) {
                    navigator.vibrate(50);
                }
            }
        }}>
            <ContextMenuTrigger asChild>
                <Button
                    className="w-full h-12 text-lg max-w-full select-none"
                    onClick={(event) => {
                        if (event.button === 0) {
                            chatStore.setChatStore((prev) => ({
                                ...prev,
                                currentSessionIndex: index,
                            }));

                            if (pathname !== "/chat/sessions") {
                                router.push("/chat/sessions");
                            }
                        }
                    }}
                    variant={
                        pathname === "/chat/sessions" && chatStore.currentSessionIndex === index
                            ? "default"
                            : "ghost"
                    }
                >
                    {session.name}
                </Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>修改名称</Button>
                    </DialogTrigger>
                    <DialogContent>
                        1
                    </DialogContent>
                </Dialog>

            </ContextMenuContent>
        </ContextMenu>


    );
}