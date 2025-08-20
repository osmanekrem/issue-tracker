
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useProjects} from "@/features/projects/lib/api";

export default function SelectProject({...props}) {
    const {data: projects, isLoading} = useProjects()

    return (
        <Select {...props} disabled={isLoading || props?.disabled}>
            <SelectTrigger className="w-full !h-12" >
                <SelectValue placeholder={isLoading ? "Yükleniyor..." : "Proje Seçiniz"}  />
            </SelectTrigger>
            <SelectContent>{(
                projects?.data?.items.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                        {project.title}
                    </SelectItem>
                ))
            )}
            </SelectContent>
        </Select>
    );
}