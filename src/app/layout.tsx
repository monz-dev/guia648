import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Guia648 - Directorio de Camargo",
  description: "Directorio digital de comercios y servicios de Camargo, Chihuahua. Encuentra turismo, gastronomía, salud y más.",
  keywords: ["directorio", "Camargo", "Chihuahua", "negocios", "turismo", "gastronomía"],
  openGraph: {
    title: "Guia648 - Directorio de Camargo",
    description: "Directorio digital de comercios y servicios de Camargo, Chihuahua.",
    url: "https://guia648.com",
    siteName: "Guia648",
    locale: "es_MX",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-sand dark:bg-sand-dark text-stone-900 dark:text-sand">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}