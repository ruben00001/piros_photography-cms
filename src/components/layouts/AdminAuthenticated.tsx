import { useEffect, type ReactElement } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import Header from "~/components/site-parts/header";
import { LoadingScreen } from "~/components/ui-written";

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
      <LoadingScreen
        text={
          status === "loading"
            ? "Checking authentication status"
            : "Not authenticated. Redirecting..."
        }
        showSpinner={status === "loading"}
      />
    );
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};
