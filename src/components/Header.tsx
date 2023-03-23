/* eslint-disable @next/next/no-img-element */
import { signIn, signOut, useSession } from "next-auth/react";
import { SideBarMenu } from "./header/SideBarMenu";

// index page as sign in
// page routes
// sign out
// deploy panel

export const Header = () => {
  const { data: sessionData, status } = useSession();
  console.log("status:", status);
  console.log("sessionData:", sessionData);

  return (
    <div className="navbar flex justify-between bg-primary text-primary-content">
      <SideBarMenu />
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown">
          {sessionData?.user ? (
            <label
              tabIndex={0}
              className="btn-ghost btn-circle avatar btn"
              onClick={() => void signOut()}
            >
              <div className="w-10 rounded-full">
                <img
                  src={sessionData?.user?.image ?? ""}
                  alt={sessionData?.user?.name ?? ""}
                />
              </div>
            </label>
          ) : (
            <button
              className="btn-ghost rounded-btn btn"
              onClick={() => void signIn()}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
