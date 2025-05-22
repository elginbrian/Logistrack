import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/app/component/Sidebar/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LogisTrack - Inventory Management",
  description: "Modern inventory and logistics tracking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-gray-50 text-gray-900`}>
        <div className="flex min-h-screen">
          <div className="fixed h-screen z-10">
            <Sidebar />
          </div>
          <div className="pl-64 mt-6 w-full transition-all duration-300">
            <main className="flex-1">
              <div className="max-w-7xl mx-auto relative">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
