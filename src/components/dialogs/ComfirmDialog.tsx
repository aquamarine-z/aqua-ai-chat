import {JSX, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useLanguageStore} from "@/store/language-store";
import {Button} from "@/components/ui/button";


export const ConfirmDialog = (props: {
    title?: string,
    message?: string,
    confirmIcon?: JSX.Element,
    cancelIcon?: JSX.Element,
    confirmButtonLabel?: string,
    cancelButtonLabel?: string,
    onConfirm: () => void,
    onCancel?: () => void,
    children?: JSX.Element
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const language = useLanguageStore().language;
    return <Dialog open={open} modal={true} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {props.children}
        </DialogTrigger>
        <DialogContent className={"w-sm  h-fit flex flex-col items-center px-4"}>
            <DialogHeader>
                <DialogTitle>{props.title || language['dialog.default.title']}</DialogTitle>
            </DialogHeader>
            <div className={"w-full flex flex-col gap-6 mt-3 items-center"}>
                <p className={"text-md"}>{props.message || language['dialog.default.messages.confirm']}</p>
                <div className={"w-full gap-2 px-0 flex flex-row items-center justify-evenly"}>

                    <Button variant={"destructive"}
                            onClick={() => {
                                props.onCancel?.();
                                setOpen(false)
                            }}
                            className={"w-1/3 text-white p-2 rounded flex flex-row items-center justify-center gap-2"}
                    >
                        {props.cancelIcon}
                        <p className={"grow text-center"}>{props.cancelButtonLabel || language['dialog.default.button.cancel']}</p>
                    </Button>
                    <Button className={"w-1/3 text-white p-2 rounded flex flex-row items-center justify-center gap-2"}
                            onClick={() => {
                                props.onConfirm?.();
                                setOpen(false);
                            }}>
                        {props.confirmIcon}
                        <p className={"grow text-center"}>{props.confirmButtonLabel || language['dialog.default.button.confirm']}</p>
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}