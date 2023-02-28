import { type ReactElement } from "react";

import { Header } from "~/components/Header";

const TempLayout = ({ children }: { children: ReactElement }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default TempLayout;
