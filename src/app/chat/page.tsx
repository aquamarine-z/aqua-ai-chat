'use client'
import {InputBox} from "@/components/input-box";

export default function ChatPage() {
    return <>
        <div className={ "fixed bottom-2 w-full flex flex-col items-center justify-center "}>
            <div className={"w-full h-fit rounded-md px-4"}>
                <InputBox/>
            </div>
        </div>
    </>
}