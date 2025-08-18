import {Link} from "@tanstack/react-router";
import {buttonVariants} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {DataTable, type TableOptions, turkishTranslations} from "tanstack-shadcn-table";
import UserAvatar from "@/components/user-avatar";
import { type User} from "@/lib/auth-client";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import { getProjectsQuery} from "@/features/projects/lib/queries";
import type {Project} from "@/features/projects/types";
import ActionMenu from "@/features/projects/ui/components/action-menu";

export default function Projects() {
    const [limit, setLimit] = useState<number>(20);
    const [offset, setOffset] = useState<number>(0);

    const handleLazyLoad = ({first, rows}: { first: number; rows: number }) => {
        setOffset(first);
        setLimit(rows);
    }

    const {data, isPending} = useQuery(getProjectsQuery(limit, offset))

    const tableOptions: TableOptions<Project> = {
        columns: [
            {
                accessorKey: "id",
                header: "#",
                size: 60,
                minSize: 60,
                maxSize: 60,
                enableResizing: false,
                cell: ({row}) => <ActionMenu rowData={row.original}/>,
            },
            {
                accessorKey: "title",
                header: "Proje Adı",
            },
            {
                accessorKey: "description",
                header: "Açıklama",
            },
            {
                accessorKey: "owner",
                header: "Sahibi",
                cell: ({row}) => {
                    const owner = row.original.owner;
                    if (!owner) {
                        return <span className="text-muted-foreground">
                            Genel
                        </span>;
                    }
                    return (
                        <div className="flex items-center gap-2">
                            <UserAvatar user={owner as User}/>
                            <span>{owner.firstName + " " + owner.lastName}</span>
                        </div>
                    )
                }
            },
            {
                accessorKey: "createdAt",
                header: "Oluşturulma Tarihi",
                cell: ({row}) => new Date(row.original.createdAt).toLocaleDateString(),
                size: 180,

                minSize: 180,
                maxSize: 180,
            }
        ],
        data: (data?.data.items ?? []) as Project[],
        lazy: true,
        onLazyLoad: handleLazyLoad,
        pagination: {
            pageSize: 20,
            totalRecords: data?.data.total ?? 0,
        },
        translations: turkishTranslations,
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        fillTableWidth: false,
    }
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-between items-center w-full">

                <h1 className="text-2xl font-bold leading-tight truncate">
                    Proje Yönetimi
                </h1>

                <Link to="/projects/create-project" className={buttonVariants()}>
                    <PlusIcon/>
                    Proje Oluştur
                </Link>
            </div>

            <div className="w-full h-full mt-4">

                <DataTable className="w-full" tableOptions={tableOptions}/>
            </div>
        </div>
    )
}