import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
  title: "MVA Motor Company | Premium Used Cars in Manchester",
  description:
    "Discover a curated selection of premium used vehicles at MVA Motor Company. Quality hand-picked cars with flexible finance options in Manchester.",
  keywords: [
    "used cars",
    "premium cars",
    "manchester",
    "car dealership",
    "finance",
    "part exchange",
  ],
  openGraph: {
    title: "MVA Motor Company | Premium Used Cars",
    description:
      "Quality hand-picked used vehicles with flexible finance options.",
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
