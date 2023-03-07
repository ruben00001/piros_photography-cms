import { createTRPCRouter } from "~/server/api/trpc";
import { albumRouter } from "./routers/album";
import { imageRouter } from "./routers/image";
import { imageTagRouter } from "./routers/image-tag";
import { imageAndAlbumTransactionRouter } from "./routers/transactions/ImageAndAlbum";

export const appRouter = createTRPCRouter({
  album: albumRouter,
  imageTag: imageTagRouter,
  image: imageRouter,
  imageAndAlbumTransaction: imageAndAlbumTransactionRouter,
});

export type AppRouter = typeof appRouter;
