import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothLayout } from "@/components/shared/smooth-layout";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Apex Select Automotive | Quality Used & Imported Vehicles",
  description:
    "Discover quality used and imported vehicles at Apex Select Automotive. Straightforward, transparent car buying in Weston-super-Mare.",
  keywords: [
    "used cars",
    "imported vehicles",
    "weston-super-mare",
    "car dealership",
    "quality cars",
    "apex select automotive",
  ],
  openGraph: {
    title: "Apex Select Automotive | Quality Used & Imported Vehicles",
    description:
      "Quality used and imported vehicles with a transparent, customer-focused approach.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SmoothLayout>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothLayout>
      </body>
    </html>
  );
}
