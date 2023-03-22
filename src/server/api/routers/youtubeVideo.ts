import { z } from "zod";
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
      return ctx.prisma.youtubeVideo.create({
        data: { index: input.index, youtubeUrl: input.youtubeUrl },
      });
    }),

  updateTitle: protectedProcedure
    .input(z.object({ albumImageId: z.string(), updatedTitle: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumImage.update({
        where: {
          id: input.albumImageId,
        },
        data: { title: input.updatedTitle },
      });
    }),

  updateDescription: protectedProcedure
    .input(
      z.object({ albumImageId: z.string(), updatedDescription: z.string() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumImage.update({
        where: {
          id: input.albumImageId,
        },
        data: { description: input.updatedDescription },
      });
    }),
});
