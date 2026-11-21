import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/redux/provider";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
  // Absolute base for canonical / Open Graph URLs set by pages (e.g. /vehicles/[slug]).
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Apex Select Automotive | Quality Used & Imported Vehicles",
    // Pages set their own title, e.g. "2023 BMW 3 Series 330i M Sport – £31,990 | Apex Select Automotive".
    template: `%s | ${SITE_NAME}`,
  },
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
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
