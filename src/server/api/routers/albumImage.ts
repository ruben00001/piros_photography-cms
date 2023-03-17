import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const albumImageRouter = createTRPCRouter({
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
        data: { title: input.updatedDescription },
      });
    }),
});
