import { z } from "zod";
import { getReorderedEntities } from "~/helpers/process-data";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.album.findUnique({
        where: { id: input.albumId },
        include: {
          coverImage: true,
          images: { include: { image: true }, orderBy: { index: "asc" } },
        },
        // include: { coverImage: true, images: input.includeImages || false },
      });
    }),

  create: protectedProcedure
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

  updateTitle: protectedProcedure
    .input(z.object({ albumId: z.string(), updatedTitle: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.update({
        where: {
          id: input.albumId,
        },
        data: { title: input.updatedTitle },
      });
    }),

  updateDescription: protectedProcedure
    .input(z.object({ albumId: z.string(), updatedDescription: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.update({
        where: {
          id: input.albumId,
        },
        data: { description: input.updatedDescription },
      });
    }),

  checkTitleIsUnique: protectedProcedure
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

  updateCoverImage: protectedProcedure
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

  delete: protectedProcedure
    .input(z.object({ album: z.object({ id: z.string(), index: z.number() }) }))
    .mutation(async ({ ctx, input }) => {
      const albumsToUpdateIndex = await ctx.prisma.album.findMany({
        where: {
          index: {
            gt: input.album.index,
          },
        },
      });

      const updateFuncs = albumsToUpdateIndex.map((album) =>
        ctx.prisma.album.update({
          where: { id: album.id },
          data: { index: album.index - 1 },
        })
      );

      const deleteFunc = ctx.prisma.album.delete({
        where: {
          id: input.album.id,
        },
      });

      return ctx.prisma.$transaction([...updateFuncs, deleteFunc]);
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        albums: z.array(z.object({ id: z.string(), index: z.number() })),
        activeAlbum: z.object({ id: z.string(), index: z.number() }),
        overAlbum: z.object({ id: z.string(), index: z.number() }),
      })
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
        })
      );

      return ctx.prisma.$transaction(updateFuncs);
    }),

  updatePublishStatus: protectedProcedure
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

  addImage: protectedProcedure
    .input(
      z.object({
        where: z.object({ albumId: z.string() }),
        data: z.object({
          image: z.object({ id: z.string(), index: z.number() }),
        }),
      })
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

  updateImage: protectedProcedure
    .input(
      z.object({
        where: z.object({ albumId: z.string(), imageId: z.string() }),
        data: z.object({ imageId: z.string() }),
      })
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

  /*   deleteImage: protectedProcedure
    .input(
      z.object({
        where: z.object({ albumId: z.string() }),
        delete: z.object({ where: z.object({ albumImageId: z.string() }) }),
        update: z.object({
          albumImages: z.array(
            z.object({ id: z.string(), currentIndex: z.number() })
          ),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteImageFunc = ctx.prisma.albumImage.delete({
        where: {
          id: input.delete.where.albumImageId,
        },
      });

      const updateImagesFuncs = input.update.albumImages.map((albumImage) =>
        ctx.prisma.albumImage.update({
          where: { id: albumImage.id },
          data: { index: albumImage.currentIndex - 1 },
        })
      );

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
    }), */
});
