import { toast } from "react-toastify";

import { MyToast } from "~/components/ui-display";

export const useToast = () => {
  const myToast = {
    success(text: string) {
      toast(<MyToast type="success" text={text} />);
    },
    error(text: string) {
      toast(<MyToast type="error" text={text} />);
    },
  };

  return myToast;
};
