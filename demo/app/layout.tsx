import type { Metadata } from "next";
import localFont from "next/font/local";
import { DemoShell } from "../shell";
import "../../app/globals.css";
import "./demo.css";

const atkinson = localFont({
  src: [
    { path: "../../app/fonts/atkinson-hyperlegible-400-latin-latin-ext.woff2", weight: "400" },
    { path: "../../app/fonts/atkinson-hyperlegible-700-latin-latin-ext.woff2", weight: "700" },
  ],
  variable: "--font-atkinson",
  display: "swap",
});
const mono = localFont({
  src: "../../app/fonts/ibm-plex-mono-400-latin-latin-ext.woff2",
  variable: "--font-mono",
  display: "swap",
});
export const metadata: Metadata = {
  title: "CRM — demonstração visual",
  robots: { index: false, follow: false },
  description: "Demonstração da interface com dados fictícios, sem backend.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      suppressHydrationWarning
      className={`${atkinson.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-bg font-sans text-text antialiased">
        <DemoShell>{children}</DemoShell>
      </body>
    </html>
  );
}
