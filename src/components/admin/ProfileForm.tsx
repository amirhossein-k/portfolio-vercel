"use client";
import { useActionState } from "react";
import type { Profile } from "@prisma/client";
import { saveProfile } from "@/app/admin/actions";
import { Area, Field, Notice, SingleImage, Submit, Toggle } from "./ui";

export default function ProfileForm({ p }: { p: Profile | null }) {
  const [state, action] = useActionState(saveProfile, undefined);
  return (
    <form action={action} className="space-y-6">
      <Notice state={state} />
      <section className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-[17px] font-bold">معرفی</h2>
        <SingleImage label="عکس پروفایل" name="avatar" current={p?.avatar} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="نام" name="name" defaultValue={p?.name} required />
          <Field label="عنوان شغلی" name="title" defaultValue={p?.title} required placeholder="برنامه‌نویس فول‌استک" />
        </div>
        <Area label="معرفی کوتاه (زیر نام در صفحه‌ی اول)" name="bio" defaultValue={p?.bio} rows={2} required />
        <Area label="درباره‌ی من (بخش مهارت‌ها)" name="about" defaultValue={p?.about} rows={4} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="سال‌های تجربه" name="yearsExp" type="number" defaultValue={p?.yearsExp ?? 5} />
          <Field label="شهر / کشور" name="location" defaultValue={p?.location} />
        </div>
        <Toggle label="نمایش برچسب «آماده‌ی همکاری»" name="available" defaultChecked={p?.available ?? true} />
      </section>
      <section className="card space-y-5 p-5 sm:p-6">
        <h2 className="text-[17px] font-bold">راه‌های ارتباطی</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="ایمیل" name="email" type="email" defaultValue={p?.email} ltr />
          <Field label="تلفن" name="phone" defaultValue={p?.phone} ltr />
          <Field label="GitHub" name="github" type="url" defaultValue={p?.github} ltr placeholder="https://github.com/..." />
          <Field label="LinkedIn" name="linkedin" type="url" defaultValue={p?.linkedin} ltr />
          <Field label="Telegram" name="telegram" type="url" defaultValue={p?.telegram} ltr placeholder="https://t.me/..." />
          <Field label="لینک رزومه (PDF)" name="resumeUrl" type="url" defaultValue={p?.resumeUrl} ltr />
        </div>
      </section>
      <div className="sticky bottom-20 z-20 flex justify-end lg:bottom-6"><Submit className="shadow-xl">ذخیره‌ی پروفایل</Submit></div>
    </form>
  );
}
