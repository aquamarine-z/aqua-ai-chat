import {JSX} from "react";
import {useLanguageStore} from "@/store/language-store";
import {ConfirmDialog} from "@/components/dialogs/ComfirmDialog";
import {toast} from "sonner";


export const DeleteDialog = (props: { children: JSX.Element, onConfirm: () => void }) => {
    const language = useLanguageStore().language;

    return <ConfirmDialog
        onConfirm={()=> {
            props.onConfirm?.()
            toast.success(language['dialog.delete.success'])
        }}
        message={language['dialog.delete.message']}
        title={language['dialog.delete.title']}
        confirmButtonLabel={language['dialog.delete.button.confirm']}
        cancelButtonLabel={language['dialog.delete.button.cancel']}
    >
        {props.children}
    </ConfirmDialog>

}