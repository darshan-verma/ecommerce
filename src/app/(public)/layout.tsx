import type { Metadata } from "next";
import PublicLayoutClient from "./public-layout-client";

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description: "Your one-stop shop for all your needs",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayoutClient>
      {children}
    </PublicLayoutClient>
  );
}
