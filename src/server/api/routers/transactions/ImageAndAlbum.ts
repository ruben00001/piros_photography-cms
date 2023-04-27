import { uid } from "uid";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const imageAndAlbumTransactionRouter = createTRPCRouter({
  createImageAndAddToBody: adminProcedure
    .input(
      z.object({
        where: z.object({ albumId: z.string() }),
        data: z.object({
          image: z.object({
            cloudinary_public_id: z.string(),
            naturalHeight: z.number(),
            naturalWidth: z.number(),
            tagIds: z.optional(z.array(z.string())),
          }),
          albumImage: z.object({ index: z.number() }),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      const newImageId = uid();

      const tags = input.data.image.tagIds?.map((tagId) => ({ id: tagId }));

      const createImage = ctx.prisma.image.create({
        data: {
          id: newImageId,
          cloudinary_public_id: input.data.image.cloudinary_public_id,
          naturalHeight: input.data.image.naturalHeight,
          naturalWidth: input.data.image.naturalWidth,
          tags: {
            connect: tags,
          },
        },
      });

      const addImageToAlbum = ctx.prisma.album.update({
        where: { id: input.where.albumId },
        data: {
          images: {
            create: {
              imageId: newImageId,
              index: input.data.albumImage.index,
            },
          },
        },
      });

      return ctx.prisma.$transaction([createImage, addImageToAlbum]);
    }),

  createImageAndUpdateBodyImage: adminProcedure
    .input(
      z.object({
        where: z.object({ albumId: z.string(), imageId: z.string() }),
        data: z.object({
          image: z.object({
            cloudinary_public_id: z.string(),
            naturalHeight: z.number(),
            naturalWidth: z.number(),
            tagIds: z.optional(z.array(z.string())),
          }),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      const newImageId = uid();

      const tags = input.data.image.tagIds?.map((tagId) => ({ id: tagId }));

      const createImage = ctx.prisma.image.create({
        data: {
          id: newImageId,
          cloudinary_public_id: input.data.image.cloudinary_public_id,
          naturalHeight: input.data.image.naturalHeight,
          naturalWidth: input.data.image.naturalWidth,
          tags: {
            connect: tags,
          },
        },
      });

      const updateBodyImage = ctx.prisma.album.update({
        where: { id: input.where.albumId },
        data: {
          images: {
            update: {
              where: {
                id: input.where.imageId,
              },
              data: {
                imageId: newImageId,
              },
            },
          },
        },
      });

      return ctx.prisma.$transaction([createImage, updateBodyImage]);
    }),

  createImageAndUpdateCoverImage: adminProcedure
    .input(
      z.object({
        where: z.object({ albumId: z.string() }),
        data: z.object({
          image: z.object({
            cloudinary_public_id: z.string(),
            naturalHeight: z.number(),
            naturalWidth: z.number(),
            tagIds: z.optional(z.array(z.string())),
          }),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      const newImageId = uid();

      const tags = input.data.image.tagIds?.map((tagId) => ({ id: tagId }));

      const createImage = ctx.prisma.image.create({
        data: {
          id: newImageId,
          cloudinary_public_id: input.data.image.cloudinary_public_id,
          naturalHeight: input.data.image.naturalHeight,
          naturalWidth: input.data.image.naturalWidth,
          tags: {
            connect: tags,
          },
        },
      });

      const addImageToAlbum = ctx.prisma.album.update({
        where: { id: input.where.albumId },
        data: {
          coverImage: { connect: { id: newImageId } },
        },
      });

      return ctx.prisma.$transaction([createImage, addImageToAlbum]);
    }),
});
