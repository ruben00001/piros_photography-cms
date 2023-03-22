import { z } from "zod";
import { getYoutubeVideoIdFromUrl } from "~/helpers/youtube";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const youtubeVideoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.youtubeVideo.findMany({ orderBy: { index: "asc" } });
  }),

  create: protectedProcedure
    .input(
      z.object({
        index: z.number(),
        youtubeUrl: z
          .string()
          .regex(
            /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
          ),
      })
    )
    .mutation(({ ctx, input }) => {
      const youtubeVideoId = getYoutubeVideoIdFromUrl({
        youtubeUrl: input.youtubeUrl,
      });

      if (!youtubeVideoId) {
        return;
      }

      return ctx.prisma.youtubeVideo.create({
        data: { index: input.index, youtubeVideoId },
      });
    }),

  updateTitle: protectedProcedure
    .input(
      z.object({
        where: z.object({ id: z.string() }),
        data: z.object({ title: z.string() }),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.youtubeVideo.update({
        where: {
          id: input.where.id,
        },
        data: { title: input.data.title },
      });
    }),

  updateDescription: protectedProcedure
    .input(
      z.object({
        where: z.object({ id: z.string() }),
        data: z.object({ description: z.string() }),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.youtubeVideo.update({
        where: {
          id: input.where.id,
        },
        data: { description: input.data.description },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        where: z.object({ id: z.string(), index: z.number() }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteFunc = ctx.prisma.youtubeVideo.delete({
        where: {
          id: input.where.id,
        },
      });

      const videosToUpdate = await ctx.prisma.youtubeVideo.findMany({
        where: {
          index: {
            gt: input.where.index,
          },
        },
      });

      const updateFuncs = videosToUpdate.map((youtubeVideo) =>
        ctx.prisma.youtubeVideo.update({
          where: { id: youtubeVideo.id },
          data: { index: youtubeVideo.index - 1 },
        })
      );

      return ctx.prisma.$transaction([...updateFuncs, deleteFunc]);
    }),
});
