import type { MetadataRoute } from "next";
import { identity } from "@/lib/identity";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${identity.name} | ${identity.role}`,
    short_name: "Zean Kurt",
    description: identity.metaDescription,
    start_url: "/",
    display: "standalone",
    // Mirrors the light-theme --bg token (manifests cannot read CSS variables).
    background_color: "#f4f1ea",
    theme_color: "#f4f1ea",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
