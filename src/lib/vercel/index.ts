import axios from "axios";

import { env } from "~/env.mjs";

//https://api.vercel.com/v1/integrations/deploy/prj_l6YdVP4UFjbpdzNcbK80ORWR0KLS/lfAAw9XFra

const headers = {
  Authorization: `Bearer ${env.NEXT_PUBLIC_VERCEL_AUTH_KEY}`,
};

export const fetchLatestDeploy = async () => {
  try {
    const res = await axios.get(
      `https://api.vercel.com/v9/projects/${env.NEXT_PUBLIC_VERCEL_FRONTEND_PROJECT_ID}`,
      {
        headers,
      },
    );
    console.log("res:", res);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return res.data.latestDeployments[0];
  } catch (error) {
    return error;
  }
};
