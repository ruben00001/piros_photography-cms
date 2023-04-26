import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";

import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const headers = {
  Authorization: `Bearer ${env.NEXT_PUBLIC_VERCEL_AUTH_KEY}`,
};

const deploymentsResValidator = z.object({
  data: z.object({
    latestDeployments: z.array(
      z.object({
        id: z.string(),
        readyState: z.enum([
          "INITIALIZING",
          "BUILDING",
          "READY",
          "ERROR",
          "QUEUED",
          "CANCELED",
          "PENDING",
        ]),
        createdAt: z.number(),
      }),
    ),
  }),
});

export const vercelRouter = createTRPCRouter({
  getLatestDeploy: protectedProcedure.query(async () => {
    const res = await axios.get(
      `https://api.vercel.com/v9/projects/${env.NEXT_PUBLIC_VERCEL_FRONTEND_PROJECT_ID}`,
      {
        headers,
      },
    );

    if (res.status !== 200) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        cause: "dunno",
        message: "error fetching...",
      });
    }

    const validated = deploymentsResValidator.parse(res);

    return validated.data.latestDeployments[0];
  }),

  deploy: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        cause: "Not authorised",
        message: "Not authorised",
      });
    }
    await axios.post(
      `https://api.vercel.com/v1/integrations/deploy/${env.NEXT_PUBLIC_VERCEL_FRONTEND_PROJECT_ID}/${env.NEXT_PUBLIC_VERCEL_FRONTEND_DEPLOY_HOOK_KEY}`,
    );

    return null;
  }),
});
