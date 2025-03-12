import {useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronUp} from "lucide-react";

export function ModelSelector() {
    const [open, setOpen] = useState(false)
    return <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild >
            <Button variant={"outline"} className={"rounded-full"}>
                {"Aqua AI Model"}
                {open ? <ChevronUp/> : <ChevronDown/>}
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side={"bottom"}  className={"w-56 h-56"}>
        </DropdownMenuContent>
    </DropdownMenu>
}