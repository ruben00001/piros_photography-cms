// Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { requestWrapper } from "../pages/api/auth/[...nextauth]";

export const getServerAuthSession = async (ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  return await getServerSession(...requestWrapper(ctx.req, ctx.res));
};
