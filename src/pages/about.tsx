import { AdminAuthenticatedLayout, SiteLayout } from "~/components/layout";
import PageContent from "~/components/my-pages/about/Entry";

const AboutPage = () => {
  return (
    <SiteLayout>
      <AdminAuthenticatedLayout>
        <PageContent />
      </AdminAuthenticatedLayout>
    </SiteLayout>
  );
};

export default AboutPage;
