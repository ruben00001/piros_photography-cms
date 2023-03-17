import { createTRPCRouter } from "~/server/api/trpc";
import { albumRouter } from "./routers/album";
import { albumImageRouter } from "./routers/albumImage";
import { imageRouter } from "./routers/image";
import { imageTagRouter } from "./routers/image-tag";
import { imageAndAlbumTransactionRouter } from "./routers/transactions/ImageAndAlbum";

export const appRouter = createTRPCRouter({
  album: albumRouter,
  imageTag: imageTagRouter,
  image: imageRouter,
  albumImage: albumImageRouter,
  imageAndAlbumTransaction: imageAndAlbumTransactionRouter,
});

export type AppRouter = typeof appRouter;
