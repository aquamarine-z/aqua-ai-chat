'use client'

import {usePathname} from "next/navigation";
import {useLanguageStore} from "@/store/language-store";

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
            case 'AI-models':
                return language["settings.AI-Models.label"]
        }
    })
    return <div className={"w-full h-12 flex flex-row px-4 items-center justify-start text-sm border-b-[1px] border-foreground/30 select-none"}>
        {translatedParts.length === 1&&translatedParts[0]===undefined ?
            <p className={"text-sm text-neutral-500"}>{language["settings.settings.label"]}</p> :
            <p className={"text-sm text-neutral-500"}>{translatedParts.join(" > ")}</p>
        }
    </div>
}