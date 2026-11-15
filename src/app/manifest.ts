import type { MetadataRoute } from "next";
import { identity } from "@/lib/identity";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${identity.name} | ${identity.role}`,
    short_name: "Zean Kurt",
    description: identity.metaDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#030712",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
