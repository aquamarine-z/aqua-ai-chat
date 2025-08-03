import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,} from "@/components/ui/sidebar"
import {ThemeToggle} from "@/components/theme-toggle";
import {useAppInformationStore} from "@/store/app-information-store";
import logoBlack from "@/../public/logo/logo-black.svg"
import Image from "next/image";
import {Button} from "./ui/button";

import {cn} from "@/lib/utils";
import {usePathname, useRouter} from "next/navigation";
import {useLanguageStore} from "@/store/language-store";
import {PenIcon, SaveIcon, SettingsIcon, TrashIcon} from "lucide-react";
import {useChatStore} from "@/store/chat-store";
import {ChatSession} from "@/schema/chat-session";
import React, {useState} from "react";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {RenameDialog} from "@/components/dialogs/RenameDialog";
import { DeleteDialog } from "./dialogs/DeleteDialog";

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
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const onItemDragStart = (index: number) => {
        //if the dragged item is the current session, update the current session index
        if (chatStore.currentSessionIndex !== index) {
            chatStore.setChatStore((prev) => ({
                ...prev,
                currentSessionIndex: index,
            }));
        }
        //console.log(index)
        setDraggingIndex(index);
    }
    const onItemDragOver = (event: React.DragEvent<HTMLDivElement>, index: number) => {
        event.preventDefault();
        if (draggingIndex !== null && draggingIndex !== index) {
            const currentSessionIndex = chatStore.currentSessionIndex;
            // If the dragged item is the current session, update the current session index
            if (currentSessionIndex === draggingIndex) {
                chatStore.setChatStore((prev) => ({
                    ...prev,
                    currentSessionIndex: index,
                }));
            }
            // If the dragged item is the same as the target index, do nothing
            if (draggingIndex === index) {
                return;
            }
            // If the dragged item is not the same as the target index, swap the sessions

            // Swap the sessions in the store
            chatStore.swapSession(draggingIndex, index);
            setDraggingIndex(index);
        }
    };
    const onItemDragEnd = () => {
        setDraggingIndex(null);
    };
    const onItemDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDraggingIndex(null);
    };
    return <SidebarContent className={"w-full h-fit px-4 flex flex-col items-center justify-start grow my-10"}>
        <h1 className={"text-foreground/70"}>{language["sidebar.chat-list.title"]}</h1>
        <div className={"w-full grow overflow-hidden rounded-xl border-[1px] border-foreground/20  drop-shadow-2xl "}>
            <div
                className={"w-full h-full overflow-y-auto p-2 flex flex-col items-center justify-start rounded-xl overflow-x-hidden"}>
                {chatStore.sessions.map((session, index) => {
                    return <div key={index} onDragStart={() => onItemDragStart(index)}
                                draggable
                                onDragOver={(event) => onItemDragOver(event, index)}
                                onDragEnd={onItemDragEnd}
                                onDrop={onItemDrop}
                                className={"w-full h-fit"}
                    ><ChatSessionListItem key={index} session={session}
                                          index={index}/></div>
                })}
            </div>
        </div>

    </SidebarContent>
}

function ChatSessionListItem({session, index}: { session: ChatSession; index: number }) {
    const pathname = usePathname();
    const chatStore = useChatStore();
    const router = useRouter();
    const [informationDialogOpen, setInformationDialogOpen] = useState(false)
    const language= useLanguageStore().language;
    return (
        <>
            <Dialog open={informationDialogOpen} onOpenChange={(open) => setInformationDialogOpen(open)}>
                <DialogContent className={"w-sm h-124 flex flex-col items-center justify-start pt-8 pb-4 px-4 gap-0 "}>
                    <h1 className={"font-semibold text-[24px] "}>{session.name}</h1>
                    <div className={"w-full h-8 flex flex-col items-center justify-center px-4"}>
                        <div className={"h-[0.5px] w-full bg-neutral-600 "}></div>
                    </div>
                    <RenameDialog defaultName={session.name} onConfirm={name => {
                        chatStore.updateSessionById(session.id!!, (prev) => ({
                            ...prev,
                            name: name,
                        }))
                        setInformationDialogOpen(false);
                    }}>
                        <Button variant={"ghost"}
                                className={"w-full h-12 px-4 flex flex-row items-center justify-start gap-2"}>
                            <PenIcon/>
                            <span className={"text-lg w-full text-center"}>{language['chat-session-menu.actions.rename']}</span>
                        </Button>

                    </RenameDialog>
                    <DeleteDialog onConfirm={()=>{
                        // Delete the session
                        chatStore.removeSessionById(session.id!!);
                        setInformationDialogOpen(false);
                    }}>
                         <Button variant={"ghost"}
                                className={"w-full h-12 px-4 flex flex-row items-center justify-start gap-2"}>
                            <TrashIcon/>
                            <span className={"text-lg w-full text-center"}>{language['chat-session-menu.actions.delete']}</span>
                        </Button>
                    </DeleteDialog>
                </DialogContent>
            </Dialog>
            <Button
                onContextMenu={(e) => {
                    e.preventDefault()
                    setInformationDialogOpen(true);
                }}
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

        </>


    );
}

/*
function ChatSessionListItem({session, index}: { session: ChatSession; index: number }) {
    const pathname = usePathname();
    const chatStore = useChatStore();
    const router = useRouter();
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    return (
        <>

            <ContextMenu modal={true} onOpenChange={(open) => {
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
                    <RenameDialog onOpenChange={setRenameDialogOpen} open={renameDialogOpen}
                              onClose={() => setRenameDialogOpen(false)} defaultName={session.name}
                              onConfirm={(newName) => {
                                  chatStore.setChatStore((prev) => {
                                      // @ts-ignore
                                      const newSessions = [...prev.sessions];
                                      newSessions[index] = {...newSessions[index], name: newName};
                                      return {
                                          ...prev,
                                          sessions: newSessions,
                                      };
                                  });

                              }}>
                </RenameDialog>
                    <Button onClick={() => {
                        setRenameDialogOpen(true);
                    }}>改名</Button>

                </ContextMenuContent>
            </ContextMenu>
        </>


    );
}*/