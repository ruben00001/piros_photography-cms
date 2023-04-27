import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

const myId = "albums-page-id";

export const albumsPageRouter = createTRPCRouter({
  getText: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.albumsPage.findUnique({
      where: {
        id: myId,
      },
    });
  }),

  updateTitle: adminProcedure
    .input(z.object({ data: z.object({ text: z.string() }) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.albumsPage.update({
        where: {
          id: myId,
        },
        data: { title: input.data.text },
      });
    }),

  updateSubTitle: adminProcedure
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
