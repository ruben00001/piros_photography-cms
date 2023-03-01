import { createTRPCRouter } from "~/server/api/trpc";
import { albumRouter } from "./routers/album";

export const appRouter = createTRPCRouter({
  album: albumRouter,
});

export type AppRouter = typeof appRouter;
