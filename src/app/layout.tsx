import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ewune by PulchriLabs",
  description: "Programs, teacher reports, approvals, and ResultDesk PDFs for growing Nigerian schools."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
