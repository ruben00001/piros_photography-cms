import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const myId = "about-text-id";

export const aboutTextRouter = createTRPCRouter({
  getText: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.aboutText.findUnique({
      where: {
        id: myId,
      },
    });
  }),

  updateBody: protectedProcedure
    .input(z.object({ data: z.object({ text: z.string() }) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.aboutText.update({
        where: {
          id: myId,
        },
        data: { body: input.data.text },
      });
    }),
});
