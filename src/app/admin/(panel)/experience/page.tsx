import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import PageTitle from "@/components/admin/PageTitle";
import { DeleteButton, Submit } from "@/components/admin/ui";
import { deleteExperience, saveExperience } from "../../actions";
import type { Experience } from "@prisma/client";

function ExpFields({ e }: { e?: Experience }) {
  return (
    <>
      {e && <input type="hidden" name="id" value={e.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <label><span className="label">سمت</span><input name="role" defaultValue={e?.role} required className="input" /></label>
        <label><span className="label">شرکت</span><input name="company" defaultValue={e?.company} required className="input" /></label>
        <label><span className="label">بازه‌ی زمانی</span><input name="period" defaultValue={e?.period} className="input" placeholder="۱۴۰۲ تا اکنون" /></label>
        <label><span className="label">ترتیب</span><input name="order" type="number" defaultValue={e?.order ?? 0} className="input" /></label>
      </div>
      <label className="block"><span className="label">توضیح</span><textarea name="description" defaultValue={e?.description} rows={2} className="input" /></label>
    </>
  );
}

export default async function ExperienceAdmin() {
  const items = await prisma.experience.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  return (
    <>
      <PageTitle title="سوابق کاری" sub="به ترتیب از جدیدترین (ترتیب ۰) به قدیمی‌ترین." />
      <details className="card mb-8 p-5" open={items.length === 0}>
        <summary className="flex cursor-pointer items-center gap-2 font-bold text-amber"><Plus size={18} /> افزودن سابقه</summary>
        <form action={saveExperience} className="mt-5 space-y-3">
          <ExpFields />
          <div className="flex justify-end"><Submit>افزودن</Submit></div>
        </form>
      </details>
      <div className="space-y-4">
        {items.map((e) => (
          <div key={e.id} className="card p-5">
            <form action={saveExperience} className="space-y-3">
              <ExpFields e={e} />
              <div className="flex justify-end"><Submit>ذخیره</Submit></div>
            </form>
            <div className="-mt-11 flex w-fit"><DeleteButton action={deleteExperience.bind(null, e.id)} compact confirmText="این سابقه حذف شود؟" /></div>
          </div>
        ))}
      </div>
    </>
  );
}
