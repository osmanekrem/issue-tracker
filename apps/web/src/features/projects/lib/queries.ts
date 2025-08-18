import {mutationOptions, queryOptions} from "@tanstack/react-query";
import {queryClient, trpcClient} from "@/utils/trpc";
import {toast} from "sonner";
import type {Project} from "@/features/projects/types";
import type {CreateProjectSchema, EditProjectSchema} from "@/features/projects/schemas";

export const getProjectsQuery  = (limit?: number, offset?: number) => queryOptions({
    queryKey: ['project'],
    queryFn: () => {
        return trpcClient.project.getProjectsPaginated.query({
            limit,
            offset
        })
    }
})

export const getProjectQuery = (projectId: string) => queryOptions({
    queryKey: ['project', projectId],
    queryFn: () => {
        return trpcClient.project.getProjectById.query(
            projectId
        )
    }
})

export const createProjectQuery = mutationOptions({
    mutationFn: (data: CreateProjectSchema) => {
        return trpcClient.project.createProject.mutate(data)
    },
    onSuccess: (project) => {
        queryClient.setQueryData(
            ["project"], (oldData: { data: { items: Project[], total: number } } | undefined) => {
                if (!oldData || !oldData.data) return {data: [project], total: 1};
                return {data: {items: [...oldData.data.items, project.data], total: oldData.data.total + 1}};
            }
        )
        toast.success("Proje başarıyla oluşturuldu");
    },
})

export const editProjectQuery = (projectId: string) => mutationOptions({
    mutationFn: (data: EditProjectSchema) => {
        return trpcClient.project.updateProject.mutate({id:projectId,
             ...data});
    },
    onSuccess: (project) => {
        toast.success("Proje başarıyla düzenlendi");
        queryClient.invalidateQueries({queryKey: ["project", projectId]});
        queryClient.invalidateQueries({queryKey: ["project"]});
        queryClient.setQueryData(
            ["project", projectId], (oldData: Project | undefined) => {
                if (!oldData) return project.data;
                return {...oldData, ...project.data};
            }
        )
        queryClient.setQueryData(
            ["project"], (oldData: { data: { items: Project[], total: number } } | undefined) => {
                if (!oldData || !oldData.data) return {data: [], total: 0};
                const updatedProjects = oldData.data.items.map(p => p.id === projectId ? {...p, ...project.data} : p);
                return {data: {items: updatedProjects, total: oldData.data.total}};
            }
        )
    },
    onError: error => {
        toast.error(error.message);
    }
})

export const deleteProjectQuery = (projectId: string) => mutationOptions({
    mutationFn: () => {
        return trpcClient.project.deleteProject.mutate(
            projectId
        );
    },
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["project", projectId]});
        queryClient.setQueryData(
            ["project"], (oldData: { data: { items: Project[], total: number } } | undefined) => {
                if (!oldData || !oldData.data) return {data: [], total: 0};
                const updatedProjects = oldData.data.items.filter(project => project.id !== projectId);
                return {data: {items: updatedProjects, total: oldData.data.total - 1}};
            }
        )

        toast.success("Proje başarıyla silindi");
    },
    onError: (error) => {
        toast.error(`Proje Silinirken bir hata oluştu: ${error.message}`);
    }
})

