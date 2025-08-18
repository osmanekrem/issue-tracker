import type {RouterOutput} from "@/utils/trpc";

export type Project = RouterOutput['project']['getProjectById']['data']