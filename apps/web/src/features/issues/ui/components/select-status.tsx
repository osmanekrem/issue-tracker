
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useStatuses} from "@/features/issues/lib/api";
import {Badge} from "@/components/ui/badge";

export default function SelectStatus({...props}) {
    const {data: statuses, isLoading} = useStatuses()

    if (isLoading) {
        return <Select disabled>
            <SelectTrigger className="w-full !h-12">
                <SelectValue placeholder="Durumlar yükleniyor..." />
            </SelectTrigger>
        </Select>;
    }
    return (
        <Select {...props} disabled={isLoading || props?.disabled}>
            <SelectTrigger className="w-full !h-12" >
                <SelectValue placeholder="Durum Seçiniz"  />
            </SelectTrigger>
            <SelectContent>{(
                statuses?.data?.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
<Badge style={{
                        backgroundColor: status.color,
}}>{status.name}</Badge>
                    </SelectItem>
                ))
            )}
            </SelectContent>
        </Select>
    );
}