import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

import { Toaster } from "react-hot-toast"; 


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>

        {/* 🔔 GLOBAL TOASTER – đặt 1 lần */}
        <Toaster
          position="top-right"
          containerStyle={{
            top: 80,
            right: 20,
            zIndex: 99999, 
          }}
          gutter={12}
          toastOptions={{
            duration: 3500,
            className: "glowpurea-toast",
            style: {
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              color: "#1f2937",
              fontSize: "14px",
              fontWeight: 500,
              padding: "14px 16px",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(34,197,94,0.15)",
              backdropFilter: "blur(8px)",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#ecfdf5",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fef2f2",
              },
              style: {
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(239,68,68,0.2)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
