"use client"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useLanguageStore} from "@/store/language-store";
import {Button} from "@/components/ui/button";
import {ChevronRightIcon, GlobeIcon, MenuIcon} from "lucide-react";
import {useRouter} from "next/navigation";

export default function SettingsPage(){
    const language = useLanguageStore().language
    const router = useRouter()
    return <Card className={"w-full px-4 flex flex-col items-center justify-start gap-2"}>
        <CardHeader className={"w-full"}>
            <CardTitle className={"select-none"}>{language["settings.general.label"]}</CardTitle>
        </CardHeader>
        <CardContent className={"w-full"}>
            <Button variant={"ghost"}
                    className={"w-full h-12 flex-row items-center justify-start py-2 px-4 gap-8"}
                    onClick={() => {
                        router.push("settings/general-settings")
                    }}
            >
                <MenuIcon className={"size-8"}/>
                <span className={"text-xl"}>{language["settings.general.general.label"]}</span>
                <div className={"grow"}/>
                <ChevronRightIcon className={"size-8"}/>
            </Button>
            <Button variant={"ghost"}
                    className={"w-full h-12 flex-row items-center justify-start py-2 px-4 gap-8"}
                    onClick={() => {
                        router.push("settings/language-settings")
                    }}
            >
                <GlobeIcon className={"size-8"}/>
                <span className={"text-xl"}>{language["settings.general.language.label"]}</span>
                <div className={"grow"}/>
                <ChevronRightIcon className={"size-8"}/>
            </Button>
        </CardContent>
    </Card>

}