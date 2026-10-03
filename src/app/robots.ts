import type { MetadataRoute } from "next";
import { SITE_URL, abs } from "@/lib/seo";

// خزنده‌های گوگل، بینگ و موتورهای هوش مصنوعی (ChatGPT، Claude، Perplexity، Gemini) صراحتاً مجازند
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt"], disallow: ["/admin", "/api"] },
    ],
    sitemap: abs("/sitemap.xml"),
    host: SITE_URL,
  };
}
