import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Visual Tailwind Builder",
  description: "Build beautiful React UIs with drag & drop and export clean, production-ready Tailwind CSS code.",
  keywords: ["tailwind", "builder", "react", "drag and drop", "ui builder", "css"],
  authors: [{ name: "Visual Tailwind Builder" }],
  openGraph: {
    title: "Visual Tailwind Builder",
    description: "Build beautiful React UIs with drag & drop and export clean, production-ready Tailwind CSS code.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-white`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#f9fafb",
              border: "1px solid #374151",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#f9fafb",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f9fafb",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
