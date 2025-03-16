import {Button} from "@/components/ui/button";

export function PageHeader() {
    return <div className={"w-full h-12 sticky top-0 left-0 bg-gradient-to-b from-blue-50 via-blue-50 via-80% to-transparent z-40"}>
        <div className={"w-full h-full flex flex-row items-center px-4"}>
            <Button className={"h-2/3 hidden sm:block"} variant={"link"}>Aqua AI Chat</Button>
            <div className={"grow"}/>
        </div>
    </div>
}