'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useLanguageStore} from "@/store/language-store";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CopyIcon} from "lucide-react";
import {useApiKeyStore} from "@/store/api-key-store";

export default function DeepseekApiSettingsPage() {
    const language = useLanguageStore().language
    const apiKeyStore = useApiKeyStore()
    const data = apiKeyStore.getKey("Deepseek R1") || {
        url: "",
        key: ""
    }
    return <div className={"w-full h-fit flex flex-col gap-4"}>
        <Card>
            <CardHeader>
                <CardTitle className={"select-none"}>
                    {language["settings.AI-Models.deepseek.r1.title"]}
                </CardTitle>
            </CardHeader>
            <CardContent className={"w-full flex flex-col px-8"}>
                <div className={"w-full h-16 flex flex-row items-center gap-4"}>
                    <p className={"w-[30%]"}>
                        {language["settings.AI-Models.url"]}
                    </p>
                    <Input className={"grow"} value={data.url} onChange={e => {
                        apiKeyStore.setKey("Deepseek R1", e.target.value, data.key)
                    }}/>
                    <Button variant={"ghost"}><CopyIcon/></Button>
                </div>
                <div className={"w-full h-16 flex flex-row items-center gap-4"}>
                    <p className={" w-[30%] "}>
                        {language["settings.AI-Models.key"]}
                    </p>
                    <Input className={"grow"} value={data.key} onChange={e => {
                        apiKeyStore.setKey("Deepseek R1", data.url, e.target.value)
                    }}/>
                    <Button variant={"ghost"}><CopyIcon/></Button>
                </div>
            </CardContent>
        </Card>
    </div>
}