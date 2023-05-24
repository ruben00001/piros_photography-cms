import { useSession } from "next-auth/react";

export const useIsAdmin = () => {
  const session = useSession();

  return Boolean(session.data?.user.role === "ADMIN");
};
