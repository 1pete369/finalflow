import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { AuthContextProvider } from "@/context/useAuthContext"
import { Toaster } from "react-hot-toast"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chatify",
  description: "Chat in style!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Primary Meta Tags */}
        <meta name="application-name" content="Chatify" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Chatify" />
        <meta name="description" content="Chat in style!" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        {/* Manifest Link */}
        <link rel="manifest" href="/manifest.json" />

        {/* Favicon or Icons */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        suppressHydrationWarning
        className={`bg-neutral-800 text-white ${inter.className}`}
      >
        <AuthContextProvider>
          <Navbar />
          {children}
        </AuthContextProvider>
        <Toaster />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker Registered', reg))
            .catch(err => console.error('Service Worker Registration Failed', err));
        });
      }
    `,
          }}
        />
      </body>
    </html>
  )
}
