import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const albumRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.album.findMany({
      orderBy: { index: "asc" },
      include: { coverImage: true },
    });
  }),

  /*   getOne: protectedProcedure
    .input(z.object({ albumId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.album.findUnique({ where: { id: input.albumId } });
    }),
 */
  create: protectedProcedure
    .input(z.object({ title: z.string(), index: z.optional(z.number()) }))
    .mutation(async ({ ctx, input }) => {
      // const count = await ctx.prisma.album.count()

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
    .input(z.object({ albumId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.album.delete({
        where: {
          id: input.albumId,
        },
      });
    }),
});
