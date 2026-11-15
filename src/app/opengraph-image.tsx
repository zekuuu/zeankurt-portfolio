import { identity } from "@/lib/identity";
import { defaultOgCopy, ogSize, renderOgImage } from "@/lib/og";

export const alt = `${identity.name}, ${identity.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(defaultOgCopy);
}
