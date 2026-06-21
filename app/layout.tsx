import type { Metadata } from "next";
import { CartProvider } from "@/lib/shop/cart";
import "./globals.css";

export const metadata: Metadata = {
  title: "ypod | in my dream",
  description: "Personalized sleep audio, earbuds, remote controls, and custom wraps.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
