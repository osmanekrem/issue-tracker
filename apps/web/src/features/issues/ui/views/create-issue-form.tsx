import {useForm} from "@tanstack/react-form";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useNavigate} from "@tanstack/react-router";
import {Textarea} from "@/components/ui/textarea";
import SelectUser from "@/features/user-management/ui/components/select-user";
import {type CreateIssueSchema, createIssueSchema} from "@/features/issues/schemas";
import {useCreateIssue} from "@/features/issues/lib/api";
import SelectProject from "@/features/projects/ui/components/select-project";
import SelectStatus from "@/features/issues/ui/components/select-status";
import SelectPriority from "@/features/issues/ui/components/select-priority";

export default function CreateIssueForm() {
    const createIssue = useCreateIssue();
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            projectId: "",
            assigneeId: "",
            priorityId: "",
            statusId: "",
        } as CreateIssueSchema,
        onSubmit: async ({value}) => {
            await createIssue.mutateAsync(value).then((result) => {
                if (result.data && result.success) {
                    navigate({to: "/issues"});
                }
            })
        },
        validators: {
            onSubmit: createIssueSchema
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
                            <Label htmlFor={field.name}>Başlık</Label>
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
                                Açıklama
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
                <form.Field name="assigneeId">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>
                                Atanan Kullanıcı
                            </Label>
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
            <div>
                <form.Field name="projectId">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Proje</Label>
                            <SelectProject
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


            <div>
                <form.Field name="statusId">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Durum</Label>
                            <SelectStatus
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

            <div>
                <form.Field name="priorityId">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Öncelik</Label>
                            <SelectPriority
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
                        {state.isSubmitting ? "Gönderiliyor..." : "Issue Oluştur"}
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}