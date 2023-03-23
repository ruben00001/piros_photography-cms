import Head from "next/head";
import { type ReactElement } from "react";

export const SiteLayout = ({
  children,
  title,
}: {
  children: ReactElement;
  title?: { pageName: string };
}) => {
  return (
    <>
      <Head>
        <title>Piros Photography{title ? ` - ${title.pageName}` : null}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
};
