import { AdminAuthenticatedLayout, SiteLayout } from "~/components/layout";
import PageContent from "~/components/my-pages/images/Entry";

const ImagesPage = () => {
  return (
    <SiteLayout>
      <AdminAuthenticatedLayout>
        <PageContent />
      </AdminAuthenticatedLayout>
    </SiteLayout>
  );
};

export default ImagesPage;
