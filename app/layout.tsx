import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgenceIA — Agents IA pour e-commerce",
  description: "Plateforme SaaS d'agents IA de support client pour e-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
