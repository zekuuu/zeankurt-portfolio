/** Re-mounts per route, so each navigation fades the new page in (180ms, CSS only). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter flex flex-1 flex-col">{children}</div>;
}
