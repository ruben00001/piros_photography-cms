import { createContext, type ReactElement, useContext, useState } from "react";
import produce from "immer";

import { checkObjectHasField } from "~/helpers/general";

type StringArrState = {
  strings: string[];
  addString: (id: string) => void;
  removeString: (id: string) => void;
};

const Context = createContext<StringArrState>({} as StringArrState);

const Provider = ({
  children,
}: {
  children: ReactElement | ((args: StringArrState) => ReactElement);
}) => {
  const [ids, setIds] = useState<string[]>([]);

  function addId(newId: string) {
    setIds((ids) => {
      const updated = produce(ids, (draft) => {
        draft.push(newId);
      });

      return updated;
    });
  }

  function removeId(removedId: string) {
    setIds((ids) => {
      const updated = produce(ids, (draft) => {
        const index = draft.findIndex((tagId) => tagId === removedId);
        if (index !== -1) draft.splice(index, 1);
      });

      return updated;
    });
  }

  const value: StringArrState = {
    strings: ids,
    addString: addId,
    removeString: removeId,
  };

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
};

// should use zod for instead of checkObjectHasField?
const useThisContext = () => {
  const context = useContext(Context);

  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useEntityIdContext must be used within its provider!");
  }

  return context;
};

export {
  Provider as StringArrStateProvider,
  useThisContext as useStringArrStateContext,
};
