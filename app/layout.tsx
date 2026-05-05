import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600"]
});

const ui = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600"]
});

const tech = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-tech",
  weight: ["400", "500", "600"]
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: {
    default: "The Bricks Studio",
    template: "%s | The Bricks"
  },
  description:
    "Cinematography and film production studio crafting premium visual stories with edit suite precision."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${ui.variable} ${tech.variable} ${mono.variable}`}
    >
      <body className="bg-panel text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
