import { createFileRoute } from '@tanstack/react-router'
import GoBackButton from "@/components/go-back-button";
import EditProjectForm from "@/features/projects/ui/views/update-project-form";
import {queryClient} from "@/utils/trpc";
import {getProjectQuery} from "@/features/projects/lib/queries";

export const Route = createFileRoute('/__protected/projects/edit-project/$id')({
  component: RouteComponent,
  loader: async ({params}) => {
    if (!params.id) {
      throw new Error("Project ID is required");
    }
    const {data} = await queryClient.fetchQuery(getProjectQuery(params.id));
    return data
  }
})

function RouteComponent() {
  const project = Route.useLoaderData()
  return (
      <div className="flex flex-col w-full h-full gap-8">
        <div className="flex justify-between items-center w-full mb-4">
          <div className="flex items-center gap-x-2">
            <GoBackButton to="/projects"/>
            <h1 className="text-2xl font-bold leading-tight truncate">
              proje Düzenle
            </h1>
          </div>
        </div>

          <EditProjectForm project={project}/>
      </div>
  )
}
