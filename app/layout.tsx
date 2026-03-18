import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Co-Pilot",
  description: "An ethical AI assistant for smarter job applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* NAVBAR */}
        <nav
          style={{
            padding: "18px 20px",
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(255,255,255,0.25)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <a
              href="/"
              style={{
                fontWeight: 900,
                fontSize: 16,
                textDecoration: "none",
                color: "#111",
                letterSpacing: -0.2,
              }}
            >
              Job Co-Pilot
            </a>

            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "center",
                fontWeight: 700,
              }}
            >
              <a href="/generate" style={navLink}>
                Generate
              </a>
              <a href="/dashboard" style={navLink}>
                Dashboard
              </a>
              <a href="/about" style={navLink}>
                About
              </a>
            </div>
          </div>
        </nav>

        {children}

        {/* ✅ Google Maps JS (LOAD ONCE HERE ONLY) */}
        {mapsKey ? (
          <Script
            id="google-maps-js"
            src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
              mapsKey
            )}&v=weekly`}
            strategy="afterInteractive"
          />
        ) : null}

        {/* FOOTER */}
        <footer
          style={{
            marginTop: 80,
            padding: 24,
            borderTop: "1px solid #eee",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              opacity: 0.7,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span>© {new Date().getFullYear()} Job Co-Pilot</span>
            <span>·</span>
            <a href="/privacy">Privacy</a>
            <span>·</span>
            <a href="/terms">Terms</a>
          </div>
        </footer>
      </body>
    </html>
  );
}

const navLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#111",
  opacity: 0.9,
};
