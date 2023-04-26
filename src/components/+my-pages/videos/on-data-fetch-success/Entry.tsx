/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { api } from "~/utils/api";
import Layout from "~/components/layouts";
import Populated from "./populated/Entry";
import Unpopulated from "./unpopulated";

const OnDataFetchSuccess = () => {
  const { data } = api.youtubeVideo.getAll.useQuery();

  return (
    <Layout.ContentBody>
      <div className="p-lg">
        <h1 className="text-xl text-gray-400">Videos Page</h1>
        <p className="mt-xxs text-sm text-gray-300">
          The layout below is for editing purposes and isn&apos;t necessarily
          meant as a visual representation of the page that visitors will see.
        </p>
        <div>
          {!data!.length ? (
            <div className="mt-lg">
              <Unpopulated />
            </div>
          ) : (
            <div className="mt-lg">
              <Populated />
            </div>
          )}
        </div>
      </div>
    </Layout.ContentBody>
  );
};

export default OnDataFetchSuccess;
