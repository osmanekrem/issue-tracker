import {SidebarTrigger} from "@/components/ui/sidebar";
import SearchInput from "@/components/layout/header/search-input";

export default function AppHeader() {
    return (
        <header className="bg-sidebar flex gap-4 items-center border-sidebar-border h-16 border-b w-full px-2.5 md:px-10 py-2">
            <SidebarTrigger />
            <SearchInput />
        </header>
    )
}