import { type ReactElement } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import Layout from "~/components/layouts";
import {
  AboutPageIcon,
  AlbumsIcon,
  HomeIcon,
  ImagesPageIcon,
  VideoIcon,
} from "~/components/ui-elements";

const HomePage = () => {
  const session = useSession();

  const isGuest = session.data?.user.role === "GUEST";

  return (
    <Layout.ContentBody>
      <div className="mt-xl grid place-items-center">
        <div className="mb-xs text-4xl text-gray-300">
          <HomeIcon weight="light" />
        </div>
        <h5 className="font-bold">
          Welcome
          {isGuest ? <span className="text-blue-400"> Guest</span> : ""}
        </h5>
        {isGuest ? (
          <p className="mt-xs mb-sm text-gray-500">
            As a guest, you&apos;re in view mode.
          </p>
        ) : null}

        <PageLinks />
      </div>
    </Layout.ContentBody>
  );
};

export default HomePage;

const PageLinks = () => (
  <div className="mt-8 grid grid-cols-2 gap-8">
    <PageLink href="/albums" icon={<AlbumsIcon />} title="Albums" />
    <PageLink href="/videos" icon={<VideoIcon />} title="Videos" />
    <PageLink href="/about" icon={<AboutPageIcon />} title="About" />
    <PageLink href="/images" icon={<ImagesPageIcon />} title="Images" />
  </div>
);

const PageLink = ({
  href,
  icon,
  title,
}: {
  icon: ReactElement;
  href: string;
  title: string;
}) => (
  <Link href={href} passHref>
    <div className="flex flex-col items-center gap-4 rounded-lg border p-16 transition-all duration-75 ease-in-out hover:bg-gray-50">
      <span className="text-3xl text-gray-400">{icon}</span>
      <h2 className="text-xl text-gray-600">{title}</h2>
    </div>
  </Link>
);
