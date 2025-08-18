import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuthenticatedUser} from "@/lib/auth-client";
import {Button} from "@/components/ui/button";
import {useLogout} from "@/features/auth/lib/actions";
import UserAvatar from "@/components/user-avatar";
import {LogOutIcon, SettingsIcon} from "lucide-react";
import {Link} from "@tanstack/react-router";
import React from "react";

export default function UserMenu() {
    const session = useAuthenticatedUser()
    const logout = useLogout()
    const [open, setOpen] = React.useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <div
                    className="flex items-center w-full justify-start gap-x-2">
                    <UserAvatar user={session.user}/>
                    {session.user.name}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card space-y-1">
                <DropdownMenuLabel
                    className="p-2 h-12 flex items-center w-full justify-start gap-x-2">
                    <UserAvatar user={session.user}/>
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold">
                            {session.user.name}
                        </p>
                        <p className="text-sm font-light">
                            {session.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <Link
                        className="w-full text-foreground flex items-center gap-x-2"
                        to="/settings"
                        onClick={() => setOpen(false)}
                    >
                        <SettingsIcon className="text-foreground"/>
                        Ayarlar
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                    <Button
                        className="w-full text-foreground"
                        onClick={logout}
                        onMouseDown={(e) => e.preventDefault()}
                        onClickCapture={() => setOpen(false)}
                    >
                        <LogOutIcon className="text-foreground"/>
                        Çıkış Yap
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
