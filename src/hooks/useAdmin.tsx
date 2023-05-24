import { useIsAdmin } from "./useIsAdmin";

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
