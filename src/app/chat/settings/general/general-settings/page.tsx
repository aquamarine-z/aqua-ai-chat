'use client';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useLanguageStore} from "@/store/language-store";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";
import {ConfirmDialog} from "@/components/dialogs/ComfirmDialog";
import {DeleteAllStorageDialog} from "@/components/dialogs/DeleteAllStorageDialog";

export default function GeneralSettingsPage() {
    const language = useLanguageStore().language;
    return <div className={"w-full h-fit flex flex-col gap-4"}>
        <Card>
            <CardHeader>
                <CardTitle className={"select-none"}>
                    {language["settings.general.general.storage.title"]}
                </CardTitle>
            </CardHeader>
            <CardContent className={"w-full flex flex-col px-8"}>
                <div className={"w-full h-16 flex flex-row items-center"}>
                    <p className={"w-fit"}>
                        {language["settings.general.general.storage.clear-all"]}
                    </p>
                    <div className={"grow"}/>
                    <DeleteAllStorageDialog>
                        <Button variant={"destructive"} className={"flex flex-row items-center gap-4 px-4"}>
                            <TrashIcon/>
                            <p className={"text-center"}>{language["settings.general.general.storage.clear-button"]}</p>
                        </Button>
                    </DeleteAllStorageDialog>

                </div>
            </CardContent>
        </Card>
    </div>
}