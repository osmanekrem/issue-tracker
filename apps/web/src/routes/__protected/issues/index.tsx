import { createFileRoute } from '@tanstack/react-router'
import Issues from "@/features/issues/ui/views/issues";

export const Route = createFileRoute('/__protected/issues/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Issues />
}
