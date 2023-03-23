import { useEffect, type ReactElement } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Header from "../header";
import Spinner from "../Spinner";

export const AdminAuthenticatedLayout = ({
  children,
}: {
  children: ReactElement;
}) => {
  const { data: sessionData, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (status === "unauthenticated") {
      setTimeout(() => {
        void router.push("/api/auth/signin");
      }, 500);
    }
    if (status === "authenticated" && sessionData.user.role !== "ADMIN") {
      setTimeout(() => {
        void signOut();
        void router.push("/api/auth/signin");
      }, 500);
    }
  }, [status, sessionData?.user.role, router]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (status === "authenticated" && sessionData.user.role !== "ADMIN")
  ) {
    return (
      <div className="my-screen-center bg-gray-50">
        <div className="rounded-md bg-white/80 p-lg ">
          {status === "loading" ? (
            <div className="flex flex-col justify-center">
              <Spinner />
              <p className="font-mono">Checking authentication status...</p>
            </div>
          ) : (
            <div>
              <p className="font-mono">Not authenticated. Redirecting...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {children}
    </div>
  );
};
