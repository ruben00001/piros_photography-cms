import { randomUUID } from "crypto";
import { type NextApiRequest, type NextApiResponse } from "next";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Cookies from "cookies";
import NextAuth, { type NextAuthOptions } from "next-auth";
import { decode, encode } from "next-auth/jwt";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = requestWrapper(req, res);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await NextAuth(...data);
};

export default handler;

/* declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: Role;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
  }
} */

export function requestWrapper(
  req: NextApiRequest,
  res: NextApiResponse,
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
  const generateSessionToken = () => randomUUID();

  const fromDate = (time: number, date = Date.now()) =>
    new Date(date + time * 1000);

  const adapter = PrismaAdapter(prisma);

  const opts: NextAuthOptions = {
    // Include user.id on session
    adapter: adapter,
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          session.user.role = user.role;
        }
        return session;
      },
      async signIn({ user, account, profile }) {
        // async signIn({ user, account, profile, email, credentials }) {
        // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
        if (account?.provider === "google") {
          const isAdmin = await prisma.admin.count({
            where: { googleEmail: profile?.email },
          });

          return Boolean(isAdmin);
        } else if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user) {
            const sessionToken = generateSessionToken();
            const sessionMaxAge = 60 * 60 * 24 * 30; //30Daysconst sessionMaxAge = 60 * 60 * 24 * 30; //30Days
            const sessionExpiry = fromDate(sessionMaxAge);

            await adapter.createSession({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });

            const cookies = new Cookies(req, res);

            cookies.set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
            });
          }
        }

        return true;
      },
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          if (cookie) return cookie;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },
    // Configure one or more authentication providers
    secret: env.NEXTAUTH_SECRET,
    debug: true,
    providers: [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialProvider({
        name: "CredentialProvider",
        credentials: {
          email: { label: "Email", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          console.log(credentials);

          // verifying if credential email exists on db
          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });

          if (!user) return null;

          // if (user.password === null) return null;

          // if (user.password !== credentials?.password) return null;

          return user;
        },
      }),
    ],
  };

  return [req, res, opts];
}
