import { useSession } from "next-auth/react";

export const useAdmin = () => {
  const isAdmin = useIsAdmin();

  return {
    isAdmin,
    ifAdmin: (func: () => void) => {
      if (!isAdmin) {
        return;
      }
      func();
    },
  };
};

const useIsAdmin = () => {
  const session = useSession();

  return Boolean(session.data?.user.role === "ADMIN");
};
