import ProductManagement from "@/components/Products/ProductManagement";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Product Management | TailAdmin",
  description: "Manage products, pricing and inventory",
};

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product Management" />
      <ProductManagement />
    </div>
  );
}
