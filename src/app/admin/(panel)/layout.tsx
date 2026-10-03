import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/session";
import { logout } from "../actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="lg:flex">
      <AdminNav logout={logout} />
      <div className="min-w-0 flex-1 px-5 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
