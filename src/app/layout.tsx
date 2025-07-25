import DropdownLogout from "@/components/DropdownLogout";
import DropdownModeToggle from "@/components/DropdownModeToggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import Providers from "./providers";
import { Menu } from "lucide-react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Festival Buddy",
  description: "Track your festival acts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head></head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <header className="w-full bg-green-600 h-16 flex items-center justify-between p-3">
              <div className="w-9 h-9 bg-zinc-700 rounded-lg flex items-center justify-center">
                FB
              </div>
              <div>OpenBeatz 2025</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-9 h-9">
                    <Menu />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownLogout />
                  <DropdownModeToggle />
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <div className="flex items-center justify-center md:h-screen p-4 w-full max-w-[400px] mx-auto">
              {children}
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
