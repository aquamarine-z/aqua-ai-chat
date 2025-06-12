'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useLanguageStore} from "@/store/language-store";
import {Switch} from "@/components/ui/switch";
import useSettingsStore from "@/store/settings-store";

export default function SessionSettingsPage() {
    const language = useLanguageStore().language
    const settings = useSettingsStore()
    return <div className={"w-full h-fit flex flex-col gap-4"}>
        <Card>
            <CardHeader>
                <CardTitle className={"select-none"}>{language["settings.general.session.common"]}</CardTitle>
            </CardHeader>
            <CardContent className="w-full flex flex-col px-8">
                <div className={"w-full flex flex-row gap-2"}>
                    <p className={""}>
                        {language['settings.general.session.common.auto-generate-title']}
                    </p>
                    <div className={"grow"}/>
                    <Switch checked={settings["auto-generate-session-name"]} onCheckedChange={e => {
                        settings.setProperty({'auto-generate-session-name': e})
                    }}/>
                </div>
            </CardContent>
        </Card>
    </div>
}