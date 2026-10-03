import { Plus, Save } from "lucide-react";
import { prisma } from "@/lib/db";
import PageTitle from "@/components/admin/PageTitle";
import { DeleteButton, Submit } from "@/components/admin/ui";
import { deleteSkill, saveSkill } from "../../actions";

export default async function SkillsAdmin() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }, { id: "asc" }] });
  const cats = Array.from(new Set(skills.map((s) => s.category)));
  return (
    <>
      <PageTitle title="مهارت‌ها" sub="هر دسته یک ستون در سایت می‌شود. سطح را بین ۰ تا ۱۰۰ وارد کنید." />
      <datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist>

      <form action={saveSkill} className="card mb-8 grid gap-3 p-4 sm:grid-cols-[2fr_2fr_1fr_auto] sm:items-end">
        <label><span className="label">نام مهارت</span><input name="name" required className="input" dir="ltr" placeholder="React" /></label>
        <label><span className="label">دسته</span><input name="category" list="cats" className="input" placeholder="فرانت‌اند" /></label>
        <label><span className="label">سطح</span><input name="level" type="number" min={0} max={100} defaultValue={80} className="input" /></label>
        <Submit><Plus size={17} /> افزودن</Submit>
      </form>

      {cats.map((cat) => (
        <section key={cat} className="mb-8">
          <h2 className="mb-3 text-[17px] font-bold">{cat}</h2>
          <div className="space-y-2">
            {skills.filter((s) => s.category === cat).map((s) => (
              <div key={s.id} className="card flex flex-wrap items-end gap-2 p-3 sm:flex-nowrap">
                <form action={saveSkill} className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-[2fr_2fr_1fr_1fr_auto]">
                  <input type="hidden" name="id" value={s.id} />
                  <input name="name" defaultValue={s.name} className="input col-span-2 sm:col-span-1" dir="ltr" aria-label="نام" required />
                  <input name="category" defaultValue={s.category} list="cats" className="input col-span-2 sm:col-span-1" aria-label="دسته" />
                  <input name="level" type="number" min={0} max={100} defaultValue={s.level} className="input" aria-label="سطح" title="سطح" />
                  <input name="order" type="number" defaultValue={s.order} className="input" aria-label="ترتیب" title="ترتیب" />
                  <button className="btn-ghost col-span-2 sm:col-span-1" aria-label="ذخیره"><Save size={16} /><span className="sm:hidden">ذخیره</span></button>
                </form>
                <DeleteButton action={deleteSkill.bind(null, s.id)} compact confirmText={`«${s.name}» حذف شود؟`} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
