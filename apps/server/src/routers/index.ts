import {
    protectedProcedure, publicProcedure,
    router,
} from "../lib/trpc";
import {userRouter} from "@/routers/user";
import {issueRouter} from "@/routers/issue";
import {projectRouter} from "@/routers/project";


export const appRouter = router({
    healthCheck: publicProcedure.query(() => {
        return "OK";
    }),
    privateData: protectedProcedure.query(({ctx}) => {
        return {
            message: "This is private",
            user: ctx.session.user,
        };
    }),
    user: userRouter,
    project: projectRouter,
    issue: issueRouter,
});
export type AppRouter = typeof appRouter;
