"use client";
import { useActionState } from "react";
import { login } from "../actions";
import { Notice, Submit } from "@/components/admin/ui";

export default function LoginPage() {
  const [state, action] = useActionState(login, undefined);
  return (
    <div className="grid min-h-dvh place-items-center px-5">
      <form action={action} className="card w-full max-w-sm space-y-5 p-7">
        <div>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber font-mono text-ink">{"</>"}</span>
          <h1 className="mt-4 text-[24px] font-black">ورود به داشبورد</h1>
          <p className="text-[15px] text-muted">برای مدیریت محتوای سایت وارد شوید.</p>
        </div>
        <Notice state={state} />
        <label className="block">
          <span className="label">رمز عبور</span>
          <input className="input" type="password" name="password" required autoFocus dir="ltr" autoComplete="current-password" />
        </label>
        <Submit className="w-full">ورود</Submit>
      </form>
    </div>
  );
}
