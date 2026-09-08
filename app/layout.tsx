import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TokoBest.id – Belanja Produk Terbaik",
  description: "Temukan produk pilihan terbaik dengan harga terjangkau. Fashion, Elektronik, Kecantikan, dan banyak lagi!",
  openGraph: {
    title: "TokoBest.id – Belanja Produk Terbaik",
    description: "Temukan produk pilihan terbaik dengan harga terjangkau!",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
