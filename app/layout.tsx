import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JustSearch Employee Work Tracker",
  description: "Track daily work of JustSearch executives with an n8n + Google Sheets integration."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen main-gradient">
        {children}
      </body>
    </html>
  );
}
