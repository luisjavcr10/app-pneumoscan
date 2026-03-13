import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnalysisProvider } from "@/context/AnalysisContext";

export const metadata: Metadata = {
 title: "PneumoScan — Diagnóstico de Neumonía por IA",
 description:
  "Analiza radiografías de tórax con inteligencia artificial para detectar neumonía. Herramienta de apoyo al diagnóstico médico.",
 manifest: "/manifest.json",
 appleWebApp: {
  capable: true,
  statusBarStyle: "default",
  title: "PneumoScan",
 },
};

export const viewport: Viewport = {
 themeColor: "#0066FF",
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
  <html lang="es">
   <body>
    <AnalysisProvider>
     <div
      style={{
       minHeight: "100vh",
       display: "flex",
       flexDirection: "column",
      }}
     >
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
     </div>
    </AnalysisProvider>
   </body>
  </html>
 );
}
