import BlogManagement from "@/components/Blogs/BlogManagement";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Blog Management | TailAdmin",
  description: "Manage blog posts, categories and publishing status",
};

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Blog Management" />
      <BlogManagement />
    </div>
  );
}
