import { type LinkProps } from '@tanstack/react-router';
export type RoutePaths = LinkProps["to"];

type PathsEndingWithId<T> = T extends `${string}/$id` ? T : never;
export type EditablePathsWithId = PathsEndingWithId<RoutePaths>;