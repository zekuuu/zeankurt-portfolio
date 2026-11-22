import type { NavItem } from "@/types";

/** Same order as the sections on the home page. */
export const mainNav: NavItem[] = [
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export const photographyNav: NavItem[] = [
  { label: "Dev Portfolio", href: "/" },
  { label: "Gallery", href: "/photography" },
  { label: "Albums", href: "/photography#albums" },
  { label: "Contact", href: "/#contact" },
];

export const footerNav: NavItem[] = [
  { label: "About", href: "/#about" },
  { label: "All projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/#contact" },
  { label: "GitHub", href: "https://github.com/zekuuu", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zeank/", external: true },
];