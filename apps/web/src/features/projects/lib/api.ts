import {useMutation, useQuery} from "@tanstack/react-query";
import {
    createProjectQuery,
    deleteProjectQuery,
    editProjectQuery, getProjectsQuery,
} from "@/features/projects/lib/queries";


export const useProjects = (limit?: number, offset?: number) => {
    return useQuery(getProjectsQuery(limit, offset))
}

export const useCreateProject = () => {
    return useMutation(createProjectQuery)
}

export const useEditProject = (projectId: string) => {
    return useMutation(editProjectQuery(projectId))
}

export const useDeleteProject = (projectId: string) => {
    return useMutation(deleteProjectQuery(projectId))
}