import { AdminAuthenticatedLayout } from "./AdminAuthenticated";
import { ContentBodyLayout } from "./ContentBody";
import { SiteLayout } from "./Site";
import { Unpopulated } from "./Unpopulated";

const Layout = () => {
  throw new Error(
    "Layout exists for naming purposes only and shouldn not be used as a component",
  );
};

export default Layout;

Layout.Admin = AdminAuthenticatedLayout;
Layout.ContentBody = ContentBodyLayout;
Layout.Site = SiteLayout;
Layout.Unpopulated = Unpopulated;
