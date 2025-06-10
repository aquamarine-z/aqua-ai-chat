"use client"

import * as React from "react"
import {Airplay, Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {toast} from "sonner";
import {useLanguageStore} from "@/store/language-store";

export function ThemeToggle() {
    const {setTheme, theme} = useTheme()
    const language=useLanguageStore().language
    return (
        <Button variant="outline" size="icon" className={"hover:cursor-pointer"} onClick={() => {

            if (theme === "system") {
                toast.success(language["theme.toggle.to-light"])
                setTheme("light")
            } else if (theme === "light") {
                toast.success(language["theme.toggle.to-dark"])
                setTheme("dark")
            } else {
                toast.success(language["theme.toggle.to-system"])
                setTheme("system")
            }
        }}>
            {theme==="light"&&<Sun className="h-[1.2rem] w-[1.2rem] transition-all "/> }
            {theme==="dark"&&<Moon className="h-[1.2rem] w-[1.2rem] transition-all "/> }
            {theme==="system"&&<Airplay className={"h-[1.2rem] w-[1.2rem] transition-all"}/>}


        </Button>

    )
}
