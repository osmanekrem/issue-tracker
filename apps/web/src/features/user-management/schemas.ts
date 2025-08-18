import z from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1, "Ad zorunludur"),
    lastName: z.string().min(1, "Soyad zorunludur"),
    email: z.email("Geçersiz E-posta adresi"),
    password: z.string().min(8, "Şifre en az 8 karakterden oluşmalıdır"),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
    firstName: z.string().min(1, "Ad zorunludur"),
    lastName: z.string().min(1, "Soyad zorunludur"),
    email: z.email("Geçersiz E-posta adresi"),
})

export type EditUserSchema = z.infer<typeof editUserSchema>;

export const setPasswordSchema = z.object({
    password: z.string().min(8, "Şifre en az 8 karakterden oluşmalıdır")
});

export type SetPasswordSchema = z.infer<typeof setPasswordSchema>;