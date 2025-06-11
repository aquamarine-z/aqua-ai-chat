'use client';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useLanguageStore} from "@/store/language-store";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import {Switch} from "@/components/ui/switch";
import {useLanguageSettingsStore} from "@/store/language-settings-store";

export default function LanguageSettingsPage() {
    const {language,} = useLanguageStore();
    const {setLanguageName, languageName, asPrompt, setAsPrompt} = useLanguageSettingsStore()

    return <div className={"w-full h-fit flex flex-col gap-4"}>
        <Card>
            <CardHeader>
                <CardTitle className={"select-none"}>
                    {language["settings.general.language.title"]}
                </CardTitle>
            </CardHeader>
            <CardContent className={"w-full flex flex-col px-8"}>
                <div className={"w-full h-16 flex flex-row items-center"}>
                    <p className={"w-fit"}>
                        {language["settings.general.language.app-language"]}
                    </p>
                    <div className={"grow"}/>
                    <Select value={languageName} onValueChange={(value) => {
                        if (setLanguageName(value)) {
                            toast.success(language["settings.general.language.app-language.set.success"])
                        } else {
                            toast.error(language["settings.general.language.app-language.set.fail"])
                        }

                    }}>
                        <SelectTrigger className={"w-32"}>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"zh_cn"}>中文</SelectItem>
                            <SelectItem value={"en"}>English</SelectItem>
                            <SelectItem value={"jp"}>日本語</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className={"w-full h-16 flex flex-row items-center"}>
                    <p className={"w-fit"}>
                        {language["settings.general.language.use-language-as-system-prompt"]}
                    </p>
                    <div className={"grow"}/>
                    <Switch className={""} checked={asPrompt} onCheckedChange={(value) => {
                        setAsPrompt(value)
                    }}/>
                </div>
            </CardContent>
        </Card>
    </div>
}