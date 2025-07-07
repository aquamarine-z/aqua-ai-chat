'use client'

import {usePathname} from "next/navigation";
import {useLanguageStore} from "@/store/language-store";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {ChevronLeftIcon} from "lucide-react";

export function PathDisplayer() {
    const pathname = usePathname().replace("/chat/", "")
    const language = useLanguageStore().language
    const pathParts = pathname.split('/').filter(part => part !== '');
    const translatedParts = pathParts.map(part => {
        switch (part) {
            case 'general':
                return language["settings.general.label"]
            case 'general-settings':
                return language["settings.general.general.label"]
            case 'language-settings':
                return language["settings.general.language.label"]
            case 'theme-settings':
                return language["settings.general.theme.label"]
            case 'ai-model':
                return language["settings.AI-Models.label"]
            default:
                return part
        }
    })
    return <div
        className={"w-full min-h-12 h-12 flex flex-row px-4 items-center justify-start text-sm border-b-[1px] border-foreground/30 select-none gap-8"}>
        <SidebarTrigger className={"sm:hidden w-6 h-6 "} variant={"ghost"}/>

        {!(translatedParts.length === 1 ) &&
            <Button className={"h-8 w-fit flex flex-row items-center justify-start gap-2"} variant={"ghost"}
                    onClick={() => {
                        history.back()

                    }}>
                <ChevronLeftIcon className={"size-6"}/>
            </Button>}
        {translatedParts.length === 1  ?
            <p className={"text-sm text-neutral-500"}>{language["settings.settings.label"]}</p> :
            <p className={"text-sm text-neutral-500"}>{language["settings.settings.label"]} {" > "} {translatedParts.slice(1, translatedParts.length).join(" > ")}</p>
        }
    </div>
}