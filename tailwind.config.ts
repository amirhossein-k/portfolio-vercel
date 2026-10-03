import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0e130f",      // پس‌زمینه: سبز جنگلی خیلی تیره
        panel: "#151c16",    // کارت‌ها
        line: "#253126",     // مرزها
        paper: "#ece6da",    // متن اصلی
        muted: "#a39e90",    // متن ثانویه
        amber: "#d79a3a",    // رنگ اصلی برند
        brick: "#c0574f",    // هشدار / حذف
        moss: "#7f9a3c",     // موفقیت / آنلاین
      },
      fontFamily: {
        sans: ["var(--font-vazir)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-6%,4%) scale(1.08)" },
        },
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "none" } },
        blink: { "50%": { opacity: "0" } },
      },
      animation: {
        drift: "drift 22s ease-in-out infinite",
        rise: "rise .7s cubic-bezier(.2,.7,.2,1) both",
        blink: "blink 1s steps(1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
