import { type ReactElement } from "react";

import Header from "../header";

const AuthenticatedLayout = ({ children }: { children: ReactElement }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default AuthenticatedLayout;
