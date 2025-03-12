import {Button} from "@/components/ui/button";

export function PageHeader() {
    return <div className={"w-full h-12 sticky top-0 left-0 border-b-1 border-foreground/20"}>
        <div className={"w-full h-full flex flex-row items-center px-4"}>
            <Button className={"h-2/3 hidden sm:block"} variant={"link"}>Aqua AI Chat</Button>
            <div className={"grow"}/>
        </div>
    </div>
}