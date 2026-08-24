import RootLayoutShell from "@/components/RootLayoutShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayoutShell lang="ar" dir="rtl">
      {children}
    </RootLayoutShell>
  );
}
