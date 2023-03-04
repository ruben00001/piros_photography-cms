import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const imageTagRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.imageTag.findMany();
  }),

  create: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.imageTag.create({
        data: {
          text: input.text,
        },
      });
    }),

  updateText: protectedProcedure
    .input(z.object({ tagId: z.string(), updatedText: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.imageTag.update({
        where: {
          id: input.tagId,
        },
        data: { text: input.updatedText },
      });
    }),

  checkTextIsUnique: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ ctx, input }) => {
      const matchingTag = await ctx.prisma.imageTag.findUnique({
        where: { text: input.text },
      });

      return Boolean(!matchingTag);
    }),
});
