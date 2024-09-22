import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import "./globals.css";
import React from "react";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {Footer} from "@/components/shared/footer";
import Header from "@/components/shared/header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


export const metadata: Metadata = {
  title: "Ăn chơi nét",
  description: "Địa điểm ăn chơi thú vị",
};


export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={cn(
      "min-h-screen bg-background font-sans antialiased",
      fontSans.variable
    )}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex relative h-screen w-screen flex-col">
        <Header/>
        <div className="flex-1 flex flex-col scroll-custom overflow-y-auto">
          <div className="flex-1">
            {children}
          </div>
          <Footer/>
        </div>
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}
