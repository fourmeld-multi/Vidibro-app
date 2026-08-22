import RootLayoutShell from "@/components/RootLayoutShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayoutShell lang="ml">{children}</RootLayoutShell>;
}
