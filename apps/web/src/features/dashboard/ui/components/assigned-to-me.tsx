import {Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useQuery} from "@tanstack/react-query";
import {getIssuesPaginatedQuery} from "@/features/issues/lib/queries";
import {DataTable, type TableOptions, turkishTranslations} from "tanstack-shadcn-table";
import type {Issue} from "@/features/issues/types";
import ActionMenu from "@/components/action-menu";
import {Badge} from "@/components/ui/badge";
import UserAvatar from "@/components/user-avatar";
import {useAuthenticatedUser, type User} from "@/lib/auth-client";
import {Separator} from "@/components/ui/separator";
import {Link} from "@tanstack/react-router";
import {buttonVariants} from "@/components/ui/button";

export default function AssignedToMe() {
    const session = useAuthenticatedUser()
    const {data, isPending} = useQuery(getIssuesPaginatedQuery(5, 0, {assigneId: session.user.id}))

    const tableOptions: TableOptions<Issue> = {
        columns: [
            {
                accessorKey: "id",
                header: "#",
                size: 60,
                minSize: 60,
                maxSize: 60,
                enableResizing: false,
                cell: ({row}) => <ActionMenu rowData={row.original} name="Issue" editUrl="/issues/edit-issue/$id"/>,
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
                        backgroundColor: row.original.status?.color,
                    }}>{row.original.status?.name}</Badge>
                )
            },
            {
                accessorKey: "priority",
                header: "Öncelik",
                cell: ({row}) => (
                    <Badge style={{
                        backgroundColor: row.original.priority?.color,
                    }}>{row.original.priority?.name}</Badge>
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
                accessorKey: "createdAt",
                header: "Oluşturulma Tarihi",
                cell: ({row}) => new Date(row.original.createdAt).toLocaleDateString(),
                size: 180,

                minSize: 180,
                maxSize: 180,
            }
        ],
        data: (data?.data.items ?? []) as Issue[],
        lazy: false,
        translations: turkishTranslations,
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        fillTableWidth: true,
    }
    return (
        <Card className="gap-2.5">
            <CardHeader>
                <CardTitle>
                Issuelar
                </CardTitle>
                <CardDescription>
                    Bana En Son Atanan 5 Issue
                </CardDescription>
                <CardAction>
                    <Link to="/issues" className={buttonVariants()}>
                        Tümünü Gör
                    </Link>
                </CardAction>
            </CardHeader>
            <Separator />
            <CardContent>
                <DataTable tableOptions={tableOptions} />
            </CardContent>
        </Card>
    )
}