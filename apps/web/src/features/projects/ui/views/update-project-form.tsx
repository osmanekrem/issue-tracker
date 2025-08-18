import {useForm} from "@tanstack/react-form";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useNavigate} from "@tanstack/react-router";
import {useEditProject} from "@/features/projects/lib/api";
import {type EditProjectSchema, editProjectSchema} from "@/features/projects/schemas";
import {Textarea} from "@/components/ui/textarea";
import SelectUser from "@/features/user-management/ui/components/select-user";
import type {Project} from "@/features/projects/types";

interface Props {
    project: Project;
}

export default function EditProjectForm({
    project
                                        }: Props) {
    const editProject = useEditProject(project.id);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            title: project.title,
            description: project.description,
            ownerId: project.ownerId,
        } as EditProjectSchema,
        onSubmit: async ({value}) => {
            await editProject.mutateAsync(value).then((result) => {
                if (result.data && result.success) {
                    navigate({to: "/projects"});
                }
            })
        },
        validators: {
            onSubmit: editProjectSchema,
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
                        {state.isSubmitting ? "Gönderiliyor..." : "Kaydet"}
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}