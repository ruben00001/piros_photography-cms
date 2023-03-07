import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getAll: protectedProcedure.query(() => {
    return "";
  }),

  createSignature: protectedProcedure
    .input(z.object({ upload_preset: z.literal("signed") }))
    .query(({ input: { upload_preset } }) => {
      const timestamp = Math.round(new Date().getTime() / 1000);

      const signature = cloudinary.utils.api_sign_request(
        { timestamp, upload_preset },
        process.env.CLOUDINARY_API_SECRET as string
      );

      return { signature, timestamp };
    }),

  create: protectedProcedure
    .input(
      z.object({
        cloudinary_public_id: z.string(),
        keywords: z.optional(z.array(z.string())),
      })
    )
    .mutation(({ ctx, input: { cloudinary_public_id } }) => {
      return ctx.prisma.image.create({
        data: {
          cloudinary_public_id,
        },
      });
    }),
});
