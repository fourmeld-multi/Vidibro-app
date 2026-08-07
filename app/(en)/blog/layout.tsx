import SiteChrome from "@/components/SiteChrome";

/** Same reasoning as app/directory/layout.tsx — put nav/footer in the layout
 *  so it can't be missed on a future post the way the directory once was. */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
