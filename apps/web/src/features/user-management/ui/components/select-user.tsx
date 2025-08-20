import {useUsers} from "@/features/user-management/lib/api";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import UserAvatar from "@/components/user-avatar";
import type {User} from "@/lib/auth-client";

export default function SelectUser({...props}) {
    const {data: users, isLoading} = useUsers()

    return (
        <Select {...props} disabled={isLoading || props?.disabled}>
                <SelectTrigger className="w-full !h-12" >
                    <SelectValue placeholder={isLoading ? "Yükleniyor..." : "Kullanıcı Seçiniz"}  />
                </SelectTrigger>
            <SelectContent>{(
                    users?.data?.users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                            <UserAvatar user={user as User} />
                            {user.name}
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    );
}