import { z } from "zod";

import { getReorderedEntities } from "~/helpers/process-data";
import { getYoutubeVideoIdFromUrl } from "~/helpers/youtube";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const youtubeVideoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.youtubeVideo.findMany({ orderBy: { index: "asc" } });
  }),

  create: adminProcedure
    .input(
      z.object({
        index: z.number(),
        youtubeUrl: z
          .string()
          .regex(
            /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
          ),
      }),
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

  updateTitle: adminProcedure
    .input(
      z.object({
        where: z.object({ id: z.string() }),
        data: z.object({ title: z.string() }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.youtubeVideo.update({
        where: {
          id: input.where.id,
        },
        data: { title: input.data.title },
      });
    }),

  updateDescription: adminProcedure
    .input(
      z.object({
        where: z.object({ id: z.string() }),
        data: z.object({ description: z.string() }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.youtubeVideo.update({
        where: {
          id: input.where.id,
        },
        data: { description: input.data.description },
      });
    }),

  delete: adminProcedure
    .input(
      z.object({
        where: z.object({ id: z.string(), index: z.number() }),
      }),
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
        }),
      );

      return ctx.prisma.$transaction([...updateFuncs, deleteFunc]);
    }),

  reorder: adminProcedure
    .input(
      z.object({
        where: z.object({
          activeVideo: z.object({ id: z.string(), index: z.number() }),
          overVideo: z.object({ id: z.string(), index: z.number() }),
        }),
        currData: z.object({
          allVideos: z.array(z.object({ id: z.string(), index: z.number() })),
        }),
      }),
    )
    .mutation(({ ctx, input }) => {
      const updateFuncs = getReorderedEntities({
        active: input.where.activeVideo,
        over: input.where.overVideo,
        entities: input.currData.allVideos,
      }).map((video) =>
        ctx.prisma.youtubeVideo.update({
          where: {
            id: video.id,
          },
          data: { index: video.index },
        }),
      );

      return ctx.prisma.$transaction(updateFuncs);
    }),
});
