/** Flat 2px progress bar driven by a CSS scroll timeline (no JS). Hidden where unsupported. */
export function ScrollProgressBar() {
  return <div aria-hidden data-no-print className="scroll-progress" />;
}
