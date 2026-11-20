import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothLayout } from "@/components/shared/smooth-layout";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothLayout>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </SmoothLayout>
  );
}
