import SiteChrome from "@/components/SiteChrome";

/**
 * Wraps every directory page — the hub and all entry pages — in the site
 * navbar and footer. Putting it in a layout rather than in each page is the
 * point: the directory pages shipped without navigation because it was an
 * easy thing to forget on a per-page import, and that will not scale to 200.
 */
export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
