import { AdminAuthenticatedLayout, SiteLayout } from "~/components/layout";
import AlbumPage from "~/components/pages/album/album-page";

export default function Page() {
  return (
    <SiteLayout title={{ pageName: "Album" }}>
      <AdminAuthenticatedLayout>
        <AlbumPage />
      </AdminAuthenticatedLayout>
    </SiteLayout>
  );
}
