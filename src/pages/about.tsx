import { AdminAuthenticatedLayout, SiteLayout } from "~/components/layout";
import PageContent from "~/about-page/Entry";

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
