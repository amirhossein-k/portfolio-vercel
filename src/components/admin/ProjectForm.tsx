"use client";
import { useActionState } from "react";
import type { Project } from "@prisma/client";
import { saveProject } from "@/app/admin/actions";
import { parseImages } from "@/lib/utils";
import { Area, Field, MultiImage, Notice, SingleImage, Submit, Toggle } from "./ui";

export default function ProjectForm({ p, created }: { p?: Project | null; created?: boolean }) {
  const [state, action] = useActionState(saveProject, created ? { ok: true, message: "پروژه ساخته شد." } : undefined);
  return (
    <form action={action} className="space-y-6">
      {p && <input type="hidden" name="id" value={p.id} />}
      <Notice state={state} />
      <section className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-[17px] font-bold">اطلاعات اصلی</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="عنوان پروژه" name="title" defaultValue={p?.title} required />
          <Field label="آدرس صفحه (slug)" name="slug" defaultValue={p?.slug} ltr placeholder="my-project" hint="خالی بگذارید تا از عنوان ساخته شود." />
        </div>
        <Field label="توضیح یک‌خطی" name="tagline" defaultValue={p?.tagline} required />
        <Area label="توضیحات کامل" name="description" defaultValue={p?.description} rows={6} />
        <Area label="ویژگی‌ها" name="features" defaultValue={p?.features} rows={5} hint="هر ویژگی در یک خط." />
        <Field label="تکنولوژی‌ها" name="tech" defaultValue={p?.tech} ltr placeholder="Next.js, TypeScript, PostgreSQL" hint="با کاما جدا کنید." />
      </section>
      <section className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-[17px] font-bold">لینک‌ها</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="لینک دمو / سایت" name="liveUrl" type="url" defaultValue={p?.liveUrl} ltr placeholder="https://" />
          <Field label="لینک سورس (GitHub)" name="repoUrl" type="url" defaultValue={p?.repoUrl} ltr placeholder="https://github.com/..." />
        </div>
      </section>
      <section className="card space-y-6 p-5 sm:p-6">
        <h2 className="text-[17px] font-bold">تصاویر</h2>
        <SingleImage label="تصویر کاور" name="cover" current={p?.cover} />
        <MultiImage current={parseImages(p?.images)} />
      </section>
      <section className="card space-y-4 p-5 sm:p-6">
        <h2 className="text-[17px] font-bold">نمایش</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="سال" name="year" type="number" defaultValue={p?.year} />
          <Field label="ترتیب نمایش" name="order" type="number" defaultValue={p?.order ?? 0} hint="عدد کمتر = بالاتر" />
        </div>
        <Toggle label="منتشر شود" name="published" defaultChecked={p?.published ?? true} />
        <Toggle label="پروژه‌ی ویژه (کارت بزرگ بالای لیست)" name="featured" defaultChecked={p?.featured} />
      </section>
      <div className="sticky bottom-20 z-20 flex justify-end lg:bottom-6"><Submit className="shadow-xl">{p ? "ذخیره‌ی تغییرات" : "ساخت پروژه"}</Submit></div>
    </form>
  );
}
