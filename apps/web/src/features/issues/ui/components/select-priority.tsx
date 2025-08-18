import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {usePriorities} from "@/features/issues/lib/api";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

export default function SelectPriority({...props}) {
    const {data: priorities, isLoading} = usePriorities();

    if (isLoading) {
        return <Select disabled>
            <SelectTrigger className="w-full !h-12">
                <SelectValue placeholder="Öncelikler yükleniyor..." />
            </SelectTrigger>
        </Select>;
    }
    return (
        <Select {...props} disabled={isLoading || props?.disabled}>
            <SelectTrigger className="w-full !h-12" >
                <SelectValue placeholder="Öncelik Seçiniz"  />
            </SelectTrigger>
            <SelectContent>{(
                priorities?.data?.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id}>
                        <Badge style={{
    backgroundColor: priority.color,
                        }}>{priority.name}</Badge>
                    </SelectItem>
                ))
            )}
            </SelectContent>
        </Select>
    );
}