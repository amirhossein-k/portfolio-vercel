import type { MetadataRoute } from "next";
import { HEADLINE, NAME_FA } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${NAME_FA} | ${HEADLINE}`,
    short_name: NAME_FA,
    description: HEADLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#0e130f",
    theme_color: "#0e130f",
    lang: "fa-IR",
    dir: "rtl",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
