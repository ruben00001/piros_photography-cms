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
        imageType: z.union([
          z.literal("body-add"),
          z.literal("cover"),
          z.object({
            replace: z.object({ where: z.object({ id: z.string() }) }),
          }),
        ]),
        index: z.number(),
        width: z.number(),
        height: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const tags = input.tagIds?.map((tagId) => ({ id: tagId }));

      const newImageId = uid();

      const createImage = ctx.prisma.image.create({
        data: {
          id: newImageId,
          cloudinary_public_id: input.cloudinary_public_id,
          height: input.height,
          width: input.width,
          tags: {
            connect: tags,
          },
        },
      });

      /*       const addImageToAlbum = ctx.prisma.album.update({
        where: {
          id: input.albumId,
        },
        data:
          input.imageType === "body-add"
            ? {
                images: { create: { imageId: newImageId, index: input.index } },
              }
            : {
                coverImage: {
                  connect: {
                    id: newImageId,
                  },
                },
              },
      });

      const updateAlbumImage =
        typeof input.imageType === "object" &&
        ctx.prisma.album.update({
          where: {
            id: input.albumId,
          },
          data: {
            images: {
              update: {
                where: { id: input.imageType.replace.where.id },
                data: { imageId: newImageId },
              },
            },
          },
        }); */

      const updateAlbumImages =
        typeof input.imageType === "object"
          ? ctx.prisma.album.update({
              where: {
                id: input.albumId,
              },
              data: {
                images: {
                  update: {
                    where: { id: input.imageType.replace.where.id },
                    data: { imageId: newImageId },
                  },
                },
              },
            })
          : ctx.prisma.album.update({
              where: {
                id: input.albumId,
              },
              data:
                input.imageType === "body-add"
                  ? {
                      images: {
                        create: { imageId: newImageId, index: input.index },
                      },
                    }
                  : {
                      coverImage: {
                        connect: {
                          id: newImageId,
                        },
                      },
                    },
            });

      return ctx.prisma.$transaction([createImage, updateAlbumImages]);
    }),
});
