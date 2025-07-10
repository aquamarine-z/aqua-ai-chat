import {JSX, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";

export const RenameDialog = (props: {
    children?: JSX.Element,
    onConfirm: (newName: string) => void,
    defaultName?: string,
}) => {
    const [name, setName] = useState<string>(props.defaultName || "");
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Dialog open={open} modal={true} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {props.children}
            </DialogTrigger>
            <DialogContent className={"w-[400px] h-fit flex flex-col items-center px-4"}>
                <DialogHeader>
                    <DialogTitle>Rename Session</DialogTitle>
                </DialogHeader>
                <div className={"w-full flex flex-col gap-2"}>
                    <input type="text" placeholder="Enter new session name" value={name}
                           onChange={e => setName(e.target.value)} className={"w-full p-2 border rounded"}/>

                    <button className={"w-full bg-blue-500 text-white p-2 rounded"} onClick={() => {
                        props.onConfirm(name)
                        setOpen(false);
                    }}>Save
                    </button>

                </div>

            </DialogContent>
        </Dialog>
    )
}