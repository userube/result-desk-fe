import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResultDesk by PulchriLabs",
  description: "Teacher scores, weekly reports, approvals, and PDF results for growing Nigerian schools."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
