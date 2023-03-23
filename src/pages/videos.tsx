import { AdminAuthenticatedLayout, SiteLayout } from "~/components/layout";
import PageContent from "~/videos-page/Entry";

const VideosPage = () => {
  return (
    <SiteLayout title={{ pageName: "Videos" }}>
      <AdminAuthenticatedLayout>
        <PageContent />
      </AdminAuthenticatedLayout>
    </SiteLayout>
  );
};

export default VideosPage;
