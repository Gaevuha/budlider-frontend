import type { Metadata } from "next";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { Providers } from "@/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Будлідер - Інтернет-магазин будівельних матеріалів",
  description: "Якісні будівельні матеріали з доставкою по всій Україні",
  keywords: "будівельні матеріали, цемент, цегла, інструменти, Україна",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
