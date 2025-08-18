import type {RouterOutput} from "@/utils/trpc";

export type Issue = RouterOutput["issue"]["getIssueById"]["data"];