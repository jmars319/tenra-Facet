import type { Metadata } from "next";
import type { ReactNode } from "react";
import { APP_NAME } from "@facet/config";

import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "Facet by Tenra is a search tool that helps people see questions from multiple angles without answering for them."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
