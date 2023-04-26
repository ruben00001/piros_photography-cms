import { type ReactElement } from "react";
import Head from "next/head";

export const SiteLayout = ({
  children,
  title,
}: {
  children: ReactElement;
  title?: { pageName: string };
}) => (
  <>
    <Head>
      <title>Piros Photography{title ? ` - ${title.pageName}` : ""}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {children}
  </>
);
