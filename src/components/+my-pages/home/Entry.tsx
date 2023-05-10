import { useState, type ReactElement } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import Layout from "~/components/layouts";
import { MyModal } from "~/components/ui-display";
import {
  AboutPageIcon,
  AlbumsIcon,
  HomeIcon,
  ImagesPageIcon,
  VideoIcon,
} from "~/components/ui-elements";

const welcomeKey = "welcome-shown";

const HomePage = () => {
  const session = useSession();

  const isGuest = session.data?.user.role === "GUEST";

  const welcomeShown = localStorage.getItem(welcomeKey) === "true";

  return (
    <>
      <Layout.ContentBody>
        <div className="mt-xl grid place-items-center">
          <div className="mb-xs text-4xl text-gray-300">
            <HomeIcon weight="light" />
          </div>
          <h5 className="font-bold">
            Welcome
            {isGuest ? (
              <span className="text-blue-400">
                {" "}
                {session.data.user.name || "Guest"}
              </span>
            ) : (
              ""
            )}
          </h5>
          {isGuest && welcomeShown ? (
            <p className="mt-xs mb-sm text-gray-500">
              As a guest, you&apos;re in view mode.
            </p>
          ) : null}
          <PageLinks />
        </div>
      </Layout.ContentBody>
      {isGuest && !welcomeShown ? <WelcomeModal /> : null}
    </>
  );
};

export default HomePage;

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { data: sessionData } = useSession();

  const handleCloseModal = () => {
    setIsOpen(false);
    localStorage.setItem(welcomeKey, "true");
  };

  return (
    <MyModal.Default closeModal={handleCloseModal} isOpen={isOpen} appear>
      <div className="relative  max-w-[90vw] rounded-lg bg-white p-6 text-left shadow-xl">
        <h5 className="font-bold">
          Welcome
          <span className="text-blue-400">
            {" "}
            {sessionData?.user.name || "Guest"}
          </span>
        </h5>
        <div className="mt-sm flex flex-col gap-1 text-gray-500">
          <p>
            As a guest, you&apos;re in{" "}
            <span className="font-medium ">view mode</span>.
          </p>
          <p>You won&apos;t be able to edit nor explicitly fetch data.</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="rounded-md border py-1 px-3 text-sm tracking-wide text-gray-700 transition-all duration-75 ease-in-out hover:bg-gray-50"
            onClick={handleCloseModal}
            type="button"
          >
            Okay
          </button>
        </div>
      </div>
    </MyModal.Default>
  );
};

const PageLinks = () => (
  <div className="mt-8 grid grid-cols-2 gap-8">
    <PageLink
      href="/albums"
      icon={<AlbumsIcon weight="light" />}
      title="Albums"
    />
    <PageLink
      href="/videos"
      icon={<VideoIcon weight="light" />}
      title="Videos"
    />
    <PageLink
      href="/about"
      icon={<AboutPageIcon weight="light" />}
      title="About"
    />
    <PageLink
      href="/images"
      icon={<ImagesPageIcon weight="light" />}
      title="Images"
    />
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
      <h2 className="font-serif-3 text-xl text-gray-600">{title}</h2>
    </div>
  </Link>
);
