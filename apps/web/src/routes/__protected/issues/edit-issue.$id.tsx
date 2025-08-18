import { createFileRoute } from '@tanstack/react-router'
import {queryClient} from "@/utils/trpc";
import GoBackButton from "@/components/go-back-button";
import EditIssueForm from "@/features/issues/ui/views/edit-issue-form";
import {getIssueQuery} from "@/features/issues/lib/queries";

export const Route = createFileRoute('/__protected/issues/edit-issue/$id')({
  component: RouteComponent,
  loader: async ({params}) => {
    if (!params.id) {
      throw new Error("Project ID is required");
    }
    const {data} = await queryClient.fetchQuery(getIssueQuery(params.id));
    return data
  }
})

function RouteComponent() {
  const issue = Route.useLoaderData()
  return (
      <div className="flex flex-col w-full h-full gap-8">
        <div className="flex justify-between items-center w-full mb-4">
          <div className="flex items-center gap-x-2">
            <GoBackButton to="/issues"/>
            <h1 className="text-2xl font-bold leading-tight truncate">
              Issue Düzenle
            </h1>
          </div>
        </div>

        <EditIssueForm issue={issue}/>
      </div>
  )
}
