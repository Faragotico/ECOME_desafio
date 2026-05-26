import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Repositório Acadêmico Ecome",
  description: "Plataforma de publicações acadêmicas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[hsl(0, 0%, 90%)] min-h-screen">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
