import {useMutation, useQuery} from "@tanstack/react-query";
import {createIssueQuery, deleteIssueQuery, editIssueQuery, getPrioritiesQuery, getStatusesQuery} from "@/features/issues/lib/queries";

export const useDeleteIssue = (issueId: string) => {
    return useMutation(deleteIssueQuery(issueId));
}

export const useCreateIssue = () => {
    return useMutation(createIssueQuery);
}

export const useEditIssue = (issueId: string) => {
    return useMutation(
        editIssueQuery(issueId))
}

export const usePriorities = () => {
    return useQuery(getPrioritiesQuery);
}

export const useStatuses = () => {
    return useQuery(getStatusesQuery);
}