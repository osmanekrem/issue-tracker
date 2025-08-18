import {useMutation, useQuery} from "@tanstack/react-query";
import {createUserQuery, deleteUserQuery, editUserQuery, getUsersQuery} from "@/features/user-management/lib/queries";
import {editUser} from "@/features/user-management/lib/actions";
import {toast} from "sonner";

export const useUsers = (limit?: number, offset?: number) => {
    return useQuery(getUsersQuery(limit, offset));

}

export const useDeleteUser = (userId: string) => {
    return useMutation(deleteUserQuery(userId))
}

export const useCreateUser = () => {
    return useMutation(createUserQuery);
}

export const useEditUser = (userId: string) => useMutation(editUserQuery(userId));