import {authClient} from "@/lib/auth-client";
import {trpc} from "@/utils/trpc";
import {useQuery} from "@tanstack/react-query";
import {createFileRoute} from "@tanstack/react-router";
import {useEffect} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import AssignedToMe from "@/features/dashboard/ui/components/assigned-to-me";

export const Route = createFileRoute("/__protected/dashboard")({
    component: RouteComponent,
});

function RouteComponent() {
    const {data: session, isPending} = authClient.useSession();

    return (
        <div>
            <h1 className="text-2xl font-bold leading-tight truncate mb-2.5">
                Dashboard
            </h1>
            <p className="text-xl font-semibold">Hoş Geldin,  {session?.user.name}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
               <AssignedToMe />
            </div>
        </div>
    );
}
