import useIsAdmin from "./useIsAdmin";

const useIfAdmin = () => {
  const isAdmin = useIsAdmin();

  return (func: () => void) => {
    if (!isAdmin) {
      return;
    }
    func();
  };
};

export default useIfAdmin;
