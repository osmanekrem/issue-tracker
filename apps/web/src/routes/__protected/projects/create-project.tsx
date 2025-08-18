import { createFileRoute } from '@tanstack/react-router'
import GoBackButton from "@/components/go-back-button";
import CreateProjectForm from "@/features/projects/ui/views/create-project-form";

export const Route = createFileRoute('/__protected/projects/create-project')({
  component: RouteComponent,
})

function RouteComponent() {
  return (<div className="flex flex-col w-full h-full">
    <div className="flex justify-between items-center w-full mb-4">
      <div className="flex items-center gap-x-2">
        <GoBackButton to="/projects"/>

        <h1 className="text-2xl font-bold leading-tight truncate">
            Proje Oluştur
        </h1>
      </div>
    </div>

    <CreateProjectForm/>

  </div>)
}
