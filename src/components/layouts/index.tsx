import { AdminAuthenticatedLayout } from "./AdminAuthenticated";
import { ContentBodyLayout } from "./ContentBody";
import { SiteLayout } from "./Site";

const Layout = () => {
  return <></>;
};

export default Layout;

Layout.Admin = AdminAuthenticatedLayout;
Layout.ContentBody = ContentBodyLayout;
Layout.Site = SiteLayout;
