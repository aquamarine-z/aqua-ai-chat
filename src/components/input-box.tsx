import {useInputStore} from "@/store/input-store";
import {Textarea} from "@/components/ui/textarea";

export function InputBox() {
    const inputStore = useInputStore();
    return <div
        className="w-full min-h-28 h-fit max-h-[40vh] border-[1px] border-foreground/30 rounded-lg bg-background flex flex-col py-2 px-2 ">
        <Textarea
            className={"w-full grow resize-none bg-transparent border-none shadow-none overflow-y-auto outline-0 focus:outline-0 focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:border-none"}
            onChange={e => {
                inputStore.setContent(e.target.value)
            }} value={inputStore.content}/>
        <div className={"min-h-12 flex flex-row"}></div>
    </div>
}