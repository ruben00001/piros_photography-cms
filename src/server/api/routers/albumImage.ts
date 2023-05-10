import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const albumImageRouter = createTRPCRouter({
  updateTitle: adminProcedure
    .input(z.object({ albumImageId: z.string(), updatedTitle: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumImage.update({
        where: {
          id: input.albumImageId,
        },
        data: { title: input.updatedTitle },
      });
    }),

  updateDescription: adminProcedure
    .input(
      z.object({ albumImageId: z.string(), updatedDescription: z.string() }),
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
