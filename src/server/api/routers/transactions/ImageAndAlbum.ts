import { uid } from "uid";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const imageAndAlbumTransactionRouter = createTRPCRouter({
  createImageAndAddToAlbum: protectedProcedure
    .input(
      z.object({
        albumId: z.string(),
        cloudinary_public_id: z.string(),
        tagIds: z.optional(z.array(z.string())),
      })
    )
    .mutation(({ ctx, input }) => {
      const tags = input.tagIds?.map((tagId) => ({ id: tagId }));

      const newImageId = uid();

      const createImage = ctx.prisma.image.create({
        data: {
          id: newImageId,
          cloudinary_public_id: input.cloudinary_public_id,
          tags: {
            connect: tags,
          },
        },
      });

      const addImageToAlbum = ctx.prisma.album.update({
        where: {
          id: input.albumId,
        },
        data: {
          coverImage: {
            connect: {
              id: newImageId,
            },
          },
        },
      });

      return ctx.prisma.$transaction([createImage, addImageToAlbum]);
    }),
});
