import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clash of The Titans",
  description: "Website for sign up for clash of the titans Fantasy premier league. FPL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >{children}</body>
    </html>
  );
}
