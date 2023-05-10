import { z } from "zod";

import { getReorderedEntities } from "~/helpers/process-data";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const albumRouter = createTRPCRouter({
  albumsPageGetAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.album.findMany({
      orderBy: { index: "asc" },
      include: { coverImage: true },
    });
  }),

  albumPageGetOne: protectedProcedure
    .input(
      z.object({
        albumId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.album.findUnique({
        where: { id: input.albumId },
        include: {
          coverImage: true,
          images: { include: { image: true }, orderBy: { index: "asc" } },
        },
      });
    }),

  create: adminProcedure
    .input(z.object({ title: z.string(), index: z.optional(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      const index = input.index || (await ctx.prisma.album.count());

      return ctx.prisma.album.create({
        data: {
          title: input.title,
          published: false,
          index,
        },
      });
    }),

  updateTitle: adminProcedure
    .input(z.object({ albumId: z.string(), updatedTitle: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.update({
        where: {
          id: input.albumId,
        },
        data: { title: input.updatedTitle },
      });
    }),

  updateDescription: adminProcedure
    .input(z.object({ albumId: z.string(), updatedDescription: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.update({
        where: {
          id: input.albumId,
        },
        data: { description: input.updatedDescription },
      });
    }),

  checkTitleIsUnique: adminProcedure
    .input(z.object({ title: z.string() }))
    .query(async ({ ctx, input }) => {
      const matchingAlbum = await ctx.prisma.album.findFirst({
        where: {
          title: {
            equals: input.title,
            mode: "insensitive",
          },
        },
      });

      return Boolean(!matchingAlbum);
    }),

  updateCoverImage: adminProcedure
    .input(z.object({ albumId: z.string(), imageId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.update({
        where: {
          id: input.albumId,
        },
        data: {
          coverImage: {
            connect: {
              id: input.imageId,
            },
          },
        },
      });
    }),

  delete: adminProcedure
    .input(z.object({ album: z.object({ id: z.string(), index: z.number() }) }))
    .mutation(async ({ ctx, input }) => {
      const albumsToUpdate = await ctx.prisma.album.findMany({
        where: {
          index: {
            gt: input.album.index,
          },
        },
      });

      const updateFuncs = albumsToUpdate.map((album) =>
        ctx.prisma.album.update({
          where: { id: album.id },
          data: { index: album.index - 1 },
        }),
      );

      const deleteFunc = ctx.prisma.album.delete({
        where: {
          id: input.album.id,
        },
      });

      return ctx.prisma.$transaction([...updateFuncs, deleteFunc]);
    }),

  reorder: adminProcedure
    .input(
      z.object({
        albums: z.array(z.object({ id: z.string(), index: z.number() })),
        activeAlbum: z.object({ id: z.string(), index: z.number() }),
        overAlbum: z.object({ id: z.string(), index: z.number() }),
      }),
    )
    .mutation(({ ctx, input }) => {
      const updateFuncs = getReorderedEntities({
        active: input.activeAlbum,
        over: input.overAlbum,
        entities: input.albums,
      }).map((album) =>
        ctx.prisma.album.update({
          where: {
            id: album.id,
          },
          data: { index: album.index },
        }),
      );

      return ctx.prisma.$transaction(updateFuncs);
    }),

  updatePublishStatus: adminProcedure
    .input(z.object({ albumId: z.string(), isPublished: z.boolean() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.update({
        where: {
          id: input.albumId,
        },
        data: {
          published: input.isPublished,
        },
      });
    }),

  addImage: adminProcedure
    .input(
      z.object({
        where: z.object({ albumId: z.string() }),
        data: z.object({
          image: z.object({ id: z.string(), index: z.number() }),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.update({
        where: {
          id: input.where.albumId,
        },
        data: {
          images: {
            create: {
              imageId: input.data.image.id,
              index: input.data.image.index,
            },
          },
        },
      });
    }),

  updateImage: adminProcedure
    .input(
      z.object({
        where: z.object({ albumId: z.string(), imageId: z.string() }),
        data: z.object({ imageId: z.string() }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.update({
        where: {
          id: input.where.albumId,
        },
        data: {
          images: {
            update: {
              where: {
                id: input.where.imageId,
              },
              data: { imageId: input.data.imageId },
            },
          },
        },
      });
    }),

  deleteImage: adminProcedure
    .input(
      z.object({
        where: z.object({ albumId: z.string(), imageId: z.string() }),
        data: z.object({ index: z.number() }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deleteFunc = ctx.prisma.album.update({
        where: { id: input.where.albumId },
        data: {
          images: {
            delete: {
              id: input.where.imageId,
            },
          },
        },
      });

      const albumImagesToUpdate = await ctx.prisma.albumImage.findMany({
        where: {
          AND: [
            {
              albumId: input.where.albumId,
            },
            {
              index: {
                gt: input.data.index,
              },
            },
          ],
        },
      });

      const updateFuncs = albumImagesToUpdate.map((albumImage) =>
        ctx.prisma.albumImage.update({
          where: { id: albumImage.id },
          data: { index: albumImage.index - 1 },
        }),
      );

      return ctx.prisma.$transaction([deleteFunc, ...updateFuncs]);
    }),

  reorderImages: adminProcedure
    .input(
      z.object({
        albumImages: z.array(z.object({ id: z.string(), index: z.number() })),
        activeAlbumImage: z.object({ id: z.string(), index: z.number() }),
        overAlbumImage: z.object({ id: z.string(), index: z.number() }),
      }),
    )
    .mutation(({ ctx, input }) => {
      const updateFuncs = getReorderedEntities({
        active: input.activeAlbumImage,
        over: input.overAlbumImage,
        entities: input.albumImages,
      }).map((albumImage) =>
        ctx.prisma.albumImage.update({
          where: {
            id: albumImage.id,
          },
          data: { index: albumImage.index },
        }),
      );

      return ctx.prisma.$transaction(updateFuncs);
    }),
});
