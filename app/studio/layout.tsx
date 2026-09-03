import type { Metadata } from "next";

// Never indexed, never linked from the site, and disallowed in robots.txt.
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-page">{children}</div>;
}
