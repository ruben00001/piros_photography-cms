import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import "@total-typescript/ts-reset";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import TempLayout from "~/layout/TempLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <TempLayout>
        <Component {...pageProps} />
      </TempLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
