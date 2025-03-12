import {useIsMobile} from "@/hooks/use-mobile";
import {Button} from "@/components/ui/button";
import {UploadIcon} from "lucide-react";

export function AttachmentUploader(){
    const mobile=useIsMobile()
    return <Button variant={"outline"} className={"rounded-full h-10 w-10 hover:cursor-pointer "}>
        <UploadIcon/>
    </Button>
}