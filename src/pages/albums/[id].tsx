import { AdminAuthenticatedLayout, SiteLayout } from "~/components/layout";
import AlbumPage from "~/components/my-pages/album";

export default function Page() {
  return (
    <SiteLayout title={{ pageName: "Album" }}>
      <AdminAuthenticatedLayout>
        <AlbumPage />
      </AdminAuthenticatedLayout>
    </SiteLayout>
  );
}
