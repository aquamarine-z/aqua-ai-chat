'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useLanguageStore} from "@/store/language-store";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {CopyIcon, SaveIcon, XIcon} from "lucide-react";
import {useApiKeyStore} from "@/store/api-key-store";
import {useEffect, useState} from "react";
import {toast} from "sonner";

export default function DeepseekApiSettingsPage() {
    const language = useLanguageStore().language
    return <div className={"w-full h-fit flex flex-col gap-4"}>
        <ModelBaseInformationSelectCard modelName={"Deepseek R1"}
                                        title={language["settings.AI-Models.deepseek.r1.title"]}/>
    </div>
}

export function ModelBaseInformationSelectCard(props: { modelName: string, title: string }) {
    const language = useLanguageStore().language
    const apiKeyStore = useApiKeyStore()

    const data = apiKeyStore.getKey(props.modelName) || {
        url: "",
        key: ""
    }
    const [apiKey, setApiKey] = useState(data.key)
    const [url, setUrl] = useState(data.url)
    useEffect(() => {
        const data = apiKeyStore.getKey(props.modelName) || {
            url: "",
            key: ""
        };
        setUrl(data.url);
        setApiKey(data.key)
    }, [apiKeyStore, props.modelName]);
    const hasChanged = () => {
        return apiKey !== data.key || url !== data.url
    }
    return <Card>
        <CardHeader>
            <CardTitle className={"select-none"}>
                {props.title}
            </CardTitle>
        </CardHeader>
        <CardContent className={"w-full flex flex-col px-8 items-center gap-4"}>
            <div className={"w-full h-16 flex flex-row items-center gap-4"}>
                <p className={"w-[30%]"}>
                    {language["settings.AI-Models.url"]}
                </p>
                <Input className={"grow"} value={url} onChange={e => {
                    setUrl(e.target.value)
                }}/>
                <Button variant={"ghost"} onClick={() => {
                    navigator.clipboard.writeText(apiKey).then(() => toast.success(language["copy.success"])).catch(() => {
                        toast.error(language['copy.fail'])
                    })
                }}><CopyIcon/></Button>
            </div>
            <div className={"w-full h-16 flex flex-row items-center gap-4"}>
                <p className={" w-[30%] "}>
                    {language["settings.AI-Models.key"]}
                </p>
                <Input className={"grow"} value={apiKey} onChange={e => {
                    setApiKey(e.target.value)
                }}/>
                <Button variant={"ghost"} onClick={() => {
                    navigator.clipboard.writeText(apiKey).then(() => toast.success(language["copy.success"])).catch(() => {
                        toast.error(language['copy.fail'])
                    })
                }}><CopyIcon/></Button>
            </div>
            {hasChanged() && <div className={"w-full flex flex-row items-center justify-center gap-4"}>
                <Button className={"w-28 h-10"} variant={"destructive"} onClick={() => {
                    setApiKey(data.key)
                    setUrl(data.url)
                }}><XIcon/>{language["settings.AI-Models.give-up"]}</Button>
                <Button
                    className={"w-28 h-10"} onClick={() => {
                    apiKeyStore.setKey(props.modelName, {url: url, key: apiKey})
                    toast.success(language['settings.AI-Models.save.success'])
                }}><SaveIcon/>{language["settings.AI-Models.save"]}</Button>
            </div>}

        </CardContent>
    </Card>

}