import type { GetServerSideProps, NextPage } from "next";
import { signIn } from "next-auth/react";

import Layout from "~/components/layouts";
import { GoogleIcon } from "~/components/ui-elements";
import { getServerAuthSession } from "~/server/auth";

const SignInPage: NextPage = () => {
  return (
    <Layout.Site>
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center ">
          <h1 className="text-lg font-semibold">Piros Photography CMS</h1>
          <h2 className="mt-6 text-xl">Sign In</h2>
          <button
            className="mt-12 flex items-center gap-8 rounded-lg border py-4 px-10"
            onClick={() => void signIn("google")}
            type="button"
          >
            <span>
              <GoogleIcon />
            </span>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </Layout.Site>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default SignInPage;
