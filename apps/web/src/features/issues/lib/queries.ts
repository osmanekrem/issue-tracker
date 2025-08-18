import {mutationOptions, queryOptions} from "@tanstack/react-query";
import {queryClient, trpcClient} from "@/utils/trpc";
import {toast} from "sonner";
import type {Issue} from "@/features/issues/types";
import type {CreateIssueSchema} from "@/features/issues/schemas";
import type {EditIssueSchema} from "@/features/issues/schemas";

export const getIssuesPaginatedQuery  = (limit: number, offset: number) => queryOptions({
    queryKey: ['issue'],
    queryFn: () => {
        if (limit <= 0) {
            throw new Error("Limit 0'dan büyük olmalıdır");
        }
        return trpcClient.issue.getIssues.query({
            pagination: {
                limit,
                offset
            }
        })
    }
})

export const getIssueQuery = (issueId: string) => queryOptions({
    queryKey: ['issue', issueId],
    queryFn:  () => {
        return trpcClient.issue.getIssueById.query(issueId);
    }
})

export const createIssueQuery = mutationOptions({
    mutationFn: (data: CreateIssueSchema) => {
        return trpcClient.issue.createIssue.mutate(data)
    },
    onSuccess: (issue) => {
        queryClient.setQueryData(
            ["issue"], (oldData: { data: { items: Issue[], total: number } } | undefined) => {
                if (!oldData || !oldData.data) return {data: [issue], total: 1};
                return {data: {items: [...oldData.data.items, issue.data], total: oldData.data.total + 1}};
            }
        )
        toast.success("Proje başarıyla oluşturuldu");
    },
})

export const editIssueQuery = (issueId: string) => mutationOptions({
    mutationFn: (data: EditIssueSchema) => {
        return trpcClient.issue.updateIssue.mutate({id:issueId,
            ...data});
    },
    onSuccess: (issue) => {
        toast.success("Issue başarıyla düzenlendi");
        queryClient.setQueryData(
            ["issue", issueId], (oldData: Issue | undefined) => {
                if (!oldData) return issue.data;
                return {...oldData, ...issue.data};
            }
        )
        queryClient.setQueryData(
            ["issue"], (oldData: { data: { items: Issue[], total: number } } | undefined) => {
                if (!oldData || !oldData.data) return {data: [], total: 0};
                const updatedIssues = oldData.data.items.map(p => p.id === issueId ? {...p, ...issue.data} : p);
                return {data: {items: updatedIssues, total: oldData.data.total}};
            }
        )
    },
    onError: error => {
        toast.error(error.message);
    }
})

export const deleteIssueQuery = (issueId: string) => mutationOptions({
    mutationFn: () => {
        return trpcClient.issue.deleteIssue.mutate(
            issueId,
        );
    },
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["issue", issueId]});
        queryClient.setQueryData(
            ["issue"], (oldData: { data: { items: Issue[], total: number } } | undefined) => {
                if (!oldData || !oldData.data) return {data: [], total: 0};
                const updatedIssues = oldData.data.items.filter(issue => issue.id !== issueId);
                return {data: {items: updatedIssues, total: oldData.data.total - 1}};
            }
        )

        toast.success("Issue başarıyla silindi");
    },
    onError: (error) => {
        toast.error(`Issue Silinirken bir hata oluştu: ${error.message}`);
    }
})

export const  getStatusesQuery  =  queryOptions({
    queryKey: ['status'],
    queryFn: () => {
        return trpcClient.issue.getStatuses.query()
    }
})

export const getPrioritiesQuery = queryOptions({
    queryKey: ['priority'],
    queryFn: () => {
        return trpcClient.issue.getPriorities.query()
    }
})