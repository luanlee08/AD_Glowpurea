import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Management | TailAdmin",
  description: "Manage products, pricing and inventory",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
