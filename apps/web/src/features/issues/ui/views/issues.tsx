import {Link} from "@tanstack/react-router";
import {buttonVariants} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {DataTable, type TableOptions, turkishTranslations} from "tanstack-shadcn-table";
import UserAvatar from "@/components/user-avatar";
import { type User} from "@/lib/auth-client";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import ActionMenu from "@/features/issues/ui/components/action-menu";
import type {Issue} from "@/features/issues/types";
import {getIssuesPaginatedQuery} from "@/features/issues/lib/queries";
import {Badge} from "@/components/ui/badge";

export default function Issues() {
    const [limit, setLimit] = useState<number>(20);
    const [offset, setOffset] = useState<number>(0);

    const handleLazyLoad = ({first, rows}: { first: number; rows: number }) => {
        setOffset(first);
        setLimit(rows);
    }

    const {data, isPending} = useQuery(getIssuesPaginatedQuery(limit, offset))

    const tableOptions: TableOptions<Issue> = {
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
                header: "Başlık",
            },
            {
                accessorKey: "description",
                header: "Açıklama",
            },
            {
                accessorKey: "project.title",
                header: 'Proje'
            },
            {
                accessorKey: "status",
                header: "Durum",
                cell: ({row}) => (
                    <Badge style={{
                        backgroundColor: row.original.status.color,
                    }}>{row.original.status.name}</Badge>
                )
            },
            {
                accessorKey: "priority",
                header: "Öncelik",
                cell: ({row}) => (
                    <Badge style={{
                        backgroundColor: row.original.priority.color,
                    }}>{row.original.priority.name}</Badge>
                )
            },
            {
                accessorKey: "reporter",
                header: "Raporlayan",
                cell: ({row}) => {
                    const reporter = row.original.reporter;
                    if (!reporter) {
                        return <span className="text-muted-foreground">
                            Genel
                        </span>;
                    }
                    return (
                        <div className="flex items-center gap-2">
                            <UserAvatar user={reporter as User}/>
                            <span>{reporter.firstName + " " + reporter.lastName}</span>
                        </div>
                    )
                }
            },
            {
                accessorKey: "assignee",
                header: "Atanan",
                cell: ({row}) => {
                    const assignee = row.original.assignee;
                    if (!assignee) {
                        return <span className="text-muted-foreground">
                            Genel
                        </span>;
                    }
                    return (
                        <div className="flex items-center gap-2">
                            <UserAvatar user={assignee as User}/>
                            <span>{assignee.firstName + " " + assignee.lastName}</span>
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
        data: (data?.data.items ?? []) as Issue[],
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
                    Issue Yönetimi
                </h1>

                <Link to="/issues/create-isssue" className={buttonVariants()}>
                    <PlusIcon/>
                    Issue Oluştur
                </Link>
            </div>

            <div className="w-full h-full mt-4">

                <DataTable className="w-full" tableOptions={tableOptions}/>
            </div>
        </div>
    )
}