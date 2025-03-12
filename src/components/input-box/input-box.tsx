import {useInputStore} from "@/store/input-store";
import {Textarea} from "@/components/ui/textarea";
import {AttachmentUploader} from "@/components/input-box/attachment-uploader";
import {Button} from "@/components/ui/button";
import {SendIcon} from "lucide-react";
import {useLanguageStore} from "@/store/language-store";
import {ModelSelector} from "@/components/input-box/model-selector";

export function InputBox() {
    const inputStore = useInputStore();
    const languageStore = useLanguageStore()
    return <div
        className="w-full min-h-28 h-fit max-h-[40vh] border-[1px] border-foreground/10 rounded-2xl bg-background flex flex-col py-2 px-2 ">
        <Textarea
            placeholder={languageStore.language["input-box.input.placeholder"]}
            className={"w-full grow resize-none bg-transparent border-none shadow-none overflow-y-auto outline-0 focus:outline-0 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:border-none"}
            onChange={e => {
                inputStore.setContent(e.target.value)
            }} value={inputStore.content}/>
        <div className={"min-h-12 flex flex-row items-center px-2 gap-2"}>
            <AttachmentUploader/>
            <div className={"grow"}/>
            <ModelSelector/>
            <Button className={"rounded-full h-10 w-10"} disabled={inputStore.isEmpty()}>
                <SendIcon/>
            </Button>
        </div>
    </div>
}