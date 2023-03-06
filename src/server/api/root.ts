import { createTRPCRouter } from "~/server/api/trpc";
import { albumRouter } from "./routers/album";
import { imageTagRouter } from "./routers/image-tag";

export const appRouter = createTRPCRouter({
  album: albumRouter,
  imageTag: imageTagRouter,
});

export type AppRouter = typeof appRouter;
