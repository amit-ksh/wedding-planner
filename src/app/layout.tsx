import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "~/lib/utils";
import { Toaster } from "~/components/ui/toaster";

import "../styles/globals.css";
import Navbar from "~/components/Navbar";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wedding Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <TRPCReactProvider>
        <body
          className={cn(
            "grainy min-h-screen font-sans antialiased",
            inter.className,
          )}
        >
          <Navbar />
          {children}
          <Toaster />
        </body>
      </TRPCReactProvider>
    </html>
  );
}
