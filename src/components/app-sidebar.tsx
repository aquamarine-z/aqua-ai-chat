import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,} from "@/components/ui/sidebar"
import {ThemeToggle} from "@/components/theme-toggle";
import {useAppInformationStore} from "@/store/app-information-store";

export function AppSidebar() {
    const appInformation = useAppInformationStore()
    return (
        <Sidebar>
            <SidebarHeader/>
            <SidebarContent>
                <SidebarGroup/>
                <SidebarGroup/>
            </SidebarContent>
            <SidebarFooter>
                <div className={"w-full h-full items-center flex justify-start px-4"}>
                    <p className={"text-md"}>{appInformation.version} {appInformation.name}</p>
                    <div className={"grow"}/>
                    <ThemeToggle/>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
