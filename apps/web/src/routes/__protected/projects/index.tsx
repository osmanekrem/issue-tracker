import { createFileRoute } from '@tanstack/react-router'
import Projects from "@/features/projects/ui/views/projects";

export const Route = createFileRoute('/__protected/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Projects />
}
