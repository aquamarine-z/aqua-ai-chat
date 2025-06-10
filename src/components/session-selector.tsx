import React, {useState} from "react";
import {useMediaQuery} from "react-responsive";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Drawer, DrawerContent} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {LayoutList, Pencil, PlusIcon} from "lucide-react";
import {useChatStore} from "@/store/chat-store";
import {defaultChatSession} from "@/schema/chat-session";

interface SessionSelectorProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    trigger: React.ReactNode
}

export function SessionSelector() {
    const [open, setOpen] = useState(false)
    const mobile = useMediaQuery({maxWidth: 640})
    const trigger = <Button variant={"ghost"} className={"w-10 h-10 rounded-md p-2"} onClick={() => {
        setOpen(true)
    }}>
        <LayoutList/>
    </Button>
    const props = {
        trigger,
        setOpen,
        open,
    }
    return mobile ? <SessionSelectorMobile {...props}/> :
        <SessionSelectorPc {...props}/>
}

function SessionSelectorPc(props: SessionSelectorProps) {
    return <Dialog open={props.open} onOpenChange={(v) => props.setOpen(v)}>
        {props.trigger}
        <DialogContent className={"max-w-[600px] w-[600px] h-[600px] p-0 flex flex-col"}>
            <SessionSelectorContent {...props}/>
        </DialogContent>
    </Dialog>
}

function SessionSelectorMobile(props: SessionSelectorProps) {
    return <Drawer open={props.open} onOpenChange={(v) => props.setOpen(v)}>
        {props.trigger}
        <DrawerContent className={"w-full max-h-[70vh] h-[70vh]"}>
            <SessionSelectorContent {...props}/>
        </DrawerContent>
    </Drawer>
}

export function SessionSelectorContent(props: SessionSelectorProps) {
    const chatStore = useChatStore()

    return <div className={"w-full h-full flex items-center justify-center"}>
        <div
            className={"h-[80%] w-[90%] overflow-y-auto rounded-lg px-2 py-3 flex flex-col items-center justify-start gap-2"}>
            <div className={"w-full my-2 flex flex-row items-center justify-between"}>
                <h1 className={"select-none text-foreground/60 text-xl font-bold"}>Navigator</h1>
                <Button variant={"ghost"}>
                    Show all
                </Button>
            </div>
            <Button variant={"ghost"} className={"w-full flex flex-row items-center justify-start gap-5"}
                    onClick={() => {
                        chatStore.setChatStore(prev => {
                            return {
                                ...prev,
                                sessions: prev.sessions?.concat(defaultChatSession),
                                currentSessionIndex: prev.sessions?.length,
                            }
                        })
                        props.setOpen(false)
                    }}>
                <PlusIcon/>
                <span className={"text-lg w-full text-center"}>
                    Create a new chat conversation
                </span>
            </Button>
            <div className={"w-full my-2 flex flex-row items-center justify-between"}>
                <h1 className={"select-none text-foreground/60 text-xl font-bold mb-4"}>Recent</h1>

            </div>
            {chatStore.sessions.map((session, index) => {
                return <div
                    onClick={() => {
                        chatStore.setChatStore(prev => {
                            return {
                                ...prev,
                                currentSessionIndex: index,
                            }
                        })
                        props.setOpen(false)
                    }}
                    className={"select-none hover:bg-foreground/20 hover:cursor-pointer rounded-md w-full flex flex-row items-center justify-start gap-5"}>
                        <span className={"text-lg grow text-center"}>
                            {session.name}
                        </span>
                    <div className={"flex flex-row w-fit"}>
                        <Button variant={"ghost"}>
                            <Pencil/>
                        </Button>
                    </div>
                </div>
            })}
        </div>
    </div>
}