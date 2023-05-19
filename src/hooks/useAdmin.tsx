import useIsAdmin from "./useIsAdmin";

const useAdmin = () => {
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

export default useAdmin;
