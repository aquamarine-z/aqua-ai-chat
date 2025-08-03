import {ConfirmDialog} from "@/components/dialogs/ComfirmDialog";
import {JSX} from "react";
import {useLanguageStore} from "@/store/language-store";
import {TrashIcon, XIcon} from "lucide-react";
import {stores} from "@/store";
import {toast} from "sonner";

export const DeleteAllStorageDialog=(props:{children:JSX.Element})=>{
    const language = useLanguageStore().language;
    return <ConfirmDialog
        onConfirm={()=>{
            stores.resetAllStores()
            toast.success(language['dialog.delete-all-storage.success'])
        }}
        message={language['dialog.delete-all-storage.message']}
        title={language['dialog.delete-all-storage.title']}
        confirmButtonLabel={language['dialog.delete-all-storage.button.confirm']}
        cancelButtonLabel={language['dialog.delete-all-storage.button.cancel']}
        confirmIcon={<TrashIcon/>}
        cancelIcon={<XIcon/>}

    >
        {props.children}
    </ConfirmDialog>
}