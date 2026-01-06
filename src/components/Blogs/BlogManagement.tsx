"use client";
import BlogTable from "./BlogTable";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Search, Pencil, Plus } from "lucide-react";
import BlogForm, { BlogFormData } from "./BlogForm";
import toast from "react-hot-toast";
import {
  searchAdminBlogs,
  createBlog, updateBlog
} from "../../../services/blog.service";

/* ================= TYPES ================= */

interface Blog {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  category: string;
  categoryId: number;
  author: string;
  status: "Bản nháp" | "Đã xuất bản";
  featured: boolean;
  isDeleted: boolean;
  createdAt: string;
}

/* ================= COMPONENT ================= */

export default function BlogManagement() {
  const { isOpen, openModal, closeModal } = useModal();
  const CATEGORY_MAP: Record<string, number> = {
    "Tin tức": 1,
    "Hướng dẫn": 2,
    "Sự kiện": 3,
  };

  /* ===== STATE ===== */
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");

  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  /* ================= DEBOUNCE SEARCH ================= */

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(keyword);
      setPage(1);
    }, 400);

    return () => clearTimeout(t);
  }, [keyword]);

  /* ================= LOAD BLOGS ================= */
  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await searchAdminBlogs({
        keyword: search || undefined,
        page,
        pageSize,
      });

      setTotal(res.total);

      setBlogs(
        res.data.map((b: any) => ({
          id: b.blogPostId,
          title: b.blogTitle,
          content: b.blogContent,
          thumbnail: b.blogThumbnail ?? "/images/no-image.png",
          category: b.blogCategory,
          categoryId: b.categoryId, 
          author: b.authorEmail,
          status: b.isPublished ? "Đã xuất bản" : "Bản nháp",
          featured: b.isFeatured,
          isDeleted: b.isDeleted,
          createdAt: b.createdAt.split("T")[0],
        }))
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [search, page]);

  /* ================= SUBMIT BLOG ================= */

  const handleSubmitBlog = async (data: BlogFormData) => {
    try {
      const formData = new FormData();
      formData.append("BlogTitle", data.title);
      formData.append("BlogContent", data.content);
      formData.append("BlogCategoryId", String(data.categoryId));
      formData.append("IsPublished", String(data.isPublished));
      formData.append("IsFeatured", String(data.isFeatured));
      formData.append(
        "IsDeleted",
        String(editingBlog?.isDeleted ?? false)
      );

      formData.append("BlogThumbnail", data.thumbnail!);


      if (editingBlog) {
        // 🔥 EDIT
        await updateBlog(editingBlog.id, formData);
        toast.success("Cập nhật blog thành công");
      } else {
        // 🔥 CREATE
        await createBlog(formData);
        toast.success("Tạo blog thành công");
      }

      closeModal();
      setEditingBlog(null);

      await fetchBlogs();
      setPage(1);
      setKeyword("");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Có lỗi xảy ra"
      );
    }
  };



  const totalPages = Math.ceil(total / pageSize);

  /* ================= RENDER ================= */

  return (
    <div className="rounded-2xl bg-white p-6 shadow-theme-xl">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Blog</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý bài viết, xuất bản và blog nổi bật
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tiêu đề..."
              className="h-10 rounded-lg border pl-9 pr-4 text-sm"
            />
          </div>

          <button
            onClick={() => {
              setEditingBlog(null);
              openModal();
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus size={16} />
            Thêm Blog
          </button>
        </div>
      </div>

      {/* TABLE */}
      <BlogTable
        blogs={blogs}
        loading={loading}
        onEdit={(blog) => {
          setEditingBlog(blog);
          openModal();
        }}
      />
      <Modal isOpen={isOpen} onClose={() => { closeModal(); setEditingBlog(null); }} className="max-w-[720px] rounded-xl bg-white" > <div className="flex max-h-[85vh] flex-col"> <div className="border-b px-6 py-4"> <h3 className="text-lg font-semibold"> {editingBlog ? "Cập nhật Blog" : "Thêm Blog"} </h3> </div> <div className="flex-1 overflow-y-auto px-6 py-4"> <BlogForm key={editingBlog?.id ?? "create"} initialData={editingBlog ? { title: editingBlog.title, content: editingBlog.content, categoryId: editingBlog.categoryId, isPublished: editingBlog.status === "Đã xuất bản", isFeatured: editingBlog.featured, isDeleted: editingBlog.isDeleted, thumbnailUrl: editingBlog.thumbnail, } : undefined} submitText={editingBlog ? "Cập nhật" : "Tạo blog"} onCancel={() => { closeModal(); setEditingBlog(null); }} onSubmit={handleSubmitBlog} /> </div> </div> </Modal>

    </div>

  );
}
