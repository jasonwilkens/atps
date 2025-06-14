import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const iosevka = localFont({
  src: "../../public/fonts/IosevkaCustom-Regular.woff2",
});

export const metadata: Metadata = {
  title: "AT Protocol Profile",
  description: "Syndicated on the web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={iosevka.className}>{children}</body>
    </html>
  );
}
