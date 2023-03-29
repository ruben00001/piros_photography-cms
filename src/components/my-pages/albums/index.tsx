import { AdminAuthenticatedLayout, SiteLayout } from "~/components/layout";
import PageDataFetchInit from "./PageDataFetchInit";
import OnDataFetchSuccess from "./on-data-fetch-success";

// ! apply adimn layout ot other pages. change index page (to about page?)

const AlbumsPage = () => {
  return (
    <SiteLayout title={{ pageName: "Albums" }}>
      <AdminAuthenticatedLayout>
        <PageDataFetchInit>
          <OnDataFetchSuccess />
        </PageDataFetchInit>
      </AdminAuthenticatedLayout>
    </SiteLayout>
  );
};

export default AlbumsPage;
