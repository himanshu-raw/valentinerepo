import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: " A Card Game with a Surprise",
  description:
    "Play a unique Valentine's card game. Complete the collection to reveal a surprise!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
