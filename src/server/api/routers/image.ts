import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  uploadPanelGetAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.image.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        tags: true,
        albumImages: {
          select: {
            album: {
              select: {
                title: true,
              },
            },
          },
        },
        albumCoverImages: {
          select: {
            title: true,
          },
        },
      },
    });
  }),

  imagesPageGetAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.image.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        tags: true,
        _count: { select: { albumCoverImages: true, albumImages: true } },
        albumImages: {
          select: {
            album: {
              select: {
                title: true,
              },
            },
          },
        },
        albumCoverImages: {
          select: {
            title: true,
          },
        },
      },
    });
  }),

  createSignature: protectedProcedure
    .input(z.object({ upload_preset: z.literal("signed") }))
    .query(({ input: { upload_preset } }) => {
      const timestamp = Math.round(new Date().getTime() / 1000);

      const signature = cloudinary.utils.api_sign_request(
        { timestamp, upload_preset },
        env.CLOUDINARY_API_SECRET,
      );

      return { signature, timestamp };
    }),

  create: protectedProcedure
    .input(
      z.object({
        cloudinary_public_id: z.string(),
        naturalWidth: z.number(),
        naturalHeight: z.number(),
        tagIds: z.optional(z.array(z.string())),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tags = input.tagIds?.map((tagId) => ({ id: tagId }));

      return ctx.prisma.image.create({
        data: {
          cloudinary_public_id: input.cloudinary_public_id,
          naturalHeight: input.naturalHeight,
          naturalWidth: input.naturalWidth,
          tags: {
            connect: tags,
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ imageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deleteFunc = ctx.prisma.image.delete({
        where: {
          id: input.imageId,
        },
      });

      // get related albumImageIds
      // const connectedImages =

      // get related albums

      // update index

      return ctx.prisma.$transaction([deleteFunc]);
    }),

  addTag: protectedProcedure
    .input(
      z.object({
        where: z.object({ imageId: z.string() }),
        data: z.object({
          text: z.string(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.image.update({
        where: { id: input.where.imageId },
        data: {
          tags: {
            connectOrCreate: {
              create: {
                text: input.data.text,
              },
              where: {
                text: input.data.text,
              },
            },
          },
        },
      });
    }),

  removeTag: protectedProcedure
    .input(
      z.object({
        where: z.object({ imageId: z.string() }),
        data: z.object({
          tagId: z.string(),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.image.update({
        where: { id: input.where.imageId },
        data: {
          tags: {
            disconnect: {
              id: input.data.tagId,
            },
          },
        },
      });
    }),
});
