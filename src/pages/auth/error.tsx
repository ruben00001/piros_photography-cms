import type { NextPage } from "next";
import Link from "next/link";

import Layout from "~/components/layouts";

const SignInPage: NextPage = () => {
  return (
    <Layout.Site>
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Piros Photography CMS</h1>
          <div className="mt-10">
            <p>Oops...</p>
            <p className="mt-1">There was an error signing in.</p>
          </div>
          <Link href={"/auth/sign-in"} passHref>
            <button
              className="mt-12 flex items-center rounded-md border py-2 px-4 text-sm font-semibold text-gray-500"
              type="button"
            >
              Try again
            </button>
          </Link>
        </div>
      </div>
    </Layout.Site>
  );
};

export default SignInPage;
