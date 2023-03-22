import { createTRPCRouter } from "~/server/api/trpc";
import { albumRouter } from "./routers/album";
import { albumImageRouter } from "./routers/albumImage";
import { imageRouter } from "./routers/image";
import { imageTagRouter } from "./routers/image-tag";
import { imageAndAlbumTransactionRouter } from "./routers/transactions/ImageAndAlbum";
import { youtubeVideoRouter } from "./routers/youtubeVideo";

export const appRouter = createTRPCRouter({
  album: albumRouter,
  imageTag: imageTagRouter,
  image: imageRouter,
  albumImage: albumImageRouter,
  imageAndAlbumTransaction: imageAndAlbumTransactionRouter,
  youtubeVideo: youtubeVideoRouter,
});

export type AppRouter = typeof appRouter;
