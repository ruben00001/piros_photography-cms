import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const myId = "about-text-id";

export const aboutPageRouter = createTRPCRouter({
  getText: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.aboutPage.findUnique({
      where: {
        id: myId,
      },
    });
  }),

  updateBody: protectedProcedure
    .input(z.object({ data: z.object({ text: z.string() }) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aboutPage.update({
        where: {
          id: myId,
        },
        data: { body: input.data.text },
      });
    }),
});
