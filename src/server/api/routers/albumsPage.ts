import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const myId = "albums-page-id";

export const albumsPageRouter = createTRPCRouter({
  getText: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.albumsPage.findUnique({
      where: {
        id: myId,
      },
    });
  }),

  updateTitle: protectedProcedure
    .input(z.object({ data: z.object({ text: z.string() }) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumsPage.update({
        where: {
          id: myId,
        },
        data: { title: input.data.text },
      });
    }),

  updateSubTitle: protectedProcedure
    .input(z.object({ data: z.object({ text: z.string() }) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumsPage.update({
        where: {
          id: myId,
        },
        data: { subTitle: input.data.text },
      });
    }),
});
