'use client';
import {Card, CardHeader} from "@/components/ui/card";
import {useLanguageStore} from "@/store/language-store";

export default function GeneralSettingsPage() {
    const language = useLanguageStore().language;
    return <div className={"w-full h-fit flex flex-col gap-4"}>
        <Card>
            <CardHeader>
                <h1>{}</h1>
            </CardHeader>
        </Card>
    </div>
}