import { renderMonogram } from "@/lib/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return renderMonogram(size.width);
}
