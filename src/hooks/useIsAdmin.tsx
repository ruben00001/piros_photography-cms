import { useSession } from "next-auth/react";

const useIsAdmin = () => {
  const session = useSession();

  return Boolean(session.data?.user.role === "ADMIN");
};

export default useIsAdmin;
