import {useForm} from "@tanstack/react-form";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useNavigate} from "@tanstack/react-router";
import {useCreateProject} from "@/features/projects/lib/api";
import {type CreateProjectSchema, createProjectSchema} from "@/features/projects/schemas";
import {Textarea} from "@/components/ui/textarea";
import SelectUser from "@/features/user-management/ui/components/select-user";

export default function CreateProjectForm() {
    const createProject = useCreateProject();
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            ownerId: "",
        } as CreateProjectSchema,
        onSubmit: async ({value}) => {
            await createProject.mutateAsync(value).then((result) => {
                if (result.data && result.success) {
                    navigate({to: "/projects"});
                }
            })
        },
        validators: {
            onSubmit: createProjectSchema
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-4 w-full h-full"
        >
            <div>
                <form.Field name="title">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Proje Adı</Label>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.map((error) => (
                                <p key={error?.message} className="text-destructive">
                                    {error?.message}
                                </p>
                            ))}
                        </div>
                    )}
                </form.Field>
            </div>

            <div>
                <form.Field name="description">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>
                                Proje Açıklaması
                            </Label>
                            <Textarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.map((error) => (
                                <p key={error?.message} className="text-destructive">
                                    {error?.message}
                                </p>
                            ))}
                        </div>
                    )}
                </form.Field>
            </div>

            <div>
                <form.Field name="ownerId">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Proje Sahibi</Label>
                           <SelectUser
                               id={field.name}
                               name={field.name}
                               value={field.state.value}
                               onBlur={field.handleBlur}
                               onValueChange={(e:string ) => field.handleChange(e)}

                           />
                            {field.state.meta.errors.map((error) => (
                                <p key={error?.message} className="text-destructive">
                                    {error?.message}
                                </p>
                            ))}
                        </div>
                    )}
                </form.Field>
            </div>
            <form.Subscribe>
                {(state) => (
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!state.canSubmit || state.isSubmitting}
                    >
                        {state.isSubmitting ? "Gönderiliyor..." : "Proje Oluştur"}
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}