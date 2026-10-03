import { prisma } from "@/lib/db";
import PageTitle from "@/components/admin/PageTitle";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function ProfilePage() {
  const p = await prisma.profile.findUnique({ where: { id: 1 } });
  return (
    <>
      <PageTitle title="پروفایل" sub="اطلاعاتی که کارفرما اول از همه می‌بیند." />
      <ProfileForm p={p} />
    </>
  );
}
