import {JSX, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useLanguageStore} from "@/store/language-store";
import {Button} from "@/components/ui/button";


export const DeleteDialog = (props: { children: JSX.Element, onConfirm: () => void }) => {
    const language = useLanguageStore().language;
    const [open, setOpen] = useState<boolean>(false);
    return  <Dialog open={open} modal={true} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {props.children}
            </DialogTrigger>
            <DialogContent className={"w-sm  h-fit flex flex-col items-center px-4"}>
                <DialogHeader>
                    <DialogTitle>{language['dialog.delete.title']}</DialogTitle>
                </DialogHeader>
                <div className={"w-full flex flex-col gap-6 mt-3 items-center"}>
                     <p className={"text-md"}>{language['dialog.delete.message']}</p>
                    <div className={"w-full gap-2 px-0 flex flex-row items-center justify-evenly"}>

                        <Button variant={"destructive"}
                                onClick={() => {
                                    setOpen(false);
                                }}
                                className={"w-1/3 text-white p-2 rounded"}
                        >{language['dialog.delete.button.cancel']}</Button>
                        <Button className={"w-1/3 text-white p-2 rounded"}
                                onClick={() => {
                                    props.onConfirm();
                                    setOpen(false);
                                }}>{language['dialog.delete.button.confirm']}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
}