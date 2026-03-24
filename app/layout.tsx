import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tribosanta | Seja um Revendedor",
  description: "Cadastre sua loja e faça parte da família Tribosanta. Moda masculina e feminina com estilo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
