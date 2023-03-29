import { createContext, useContext, type ReactElement } from "react";
import { type YoutubeVideo } from "@prisma/client";

type Value = YoutubeVideo;

const Context = createContext<Value | null>(null);

function Provider({
  children,
  video,
}: {
  children: ReactElement | ((args: Value) => ReactElement);
  video: YoutubeVideo;
}) {
  const value: Value = video;

  return (
    <Context.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </Context.Provider>
  );
}

const useThisContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useVideoState must be used within its provider!");
  }

  return context;
};

export { Provider as VideoProvider, useThisContext as useVideoContext };
