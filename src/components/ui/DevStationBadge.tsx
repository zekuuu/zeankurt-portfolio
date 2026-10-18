const SHOWCASE_URL =
  "https://www.dev-station.dev/portfolio/07482196-6f31-4809-bc66-2ef79279a449";
const BADGE_IMAGE_URL = "https://www.dev-station.dev/badge-vertical.svg";

export function DevStationBadge() {
  return (
    <a
      className="devstation-floating-badge fixed right-0 top-1/2 z-40 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-end"
      href={SHOWCASE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View my portfolio on DEV/STATION"
    >
      <img
        src={BADGE_IMAGE_URL}
        alt="DEV/STATION"
        width={36}
        height={130}
        loading="eager"
      />
    </a>
  );
}
