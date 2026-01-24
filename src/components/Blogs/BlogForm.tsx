"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { getBlogCategories, LookupItem } from "../../../services/lookup.service";

/* ================= DYNAMIC EDITOR (FIX CHỚP) ================= */
const RichTextEditor = dynamic(
  () => import("@/components/editors/RichTextEditor"),
  { ssr: false }
);

/* ================= TYPES ================= */

export interface BlogFormData {
  title: string;
  content: string;
  categoryId: number;
  isPublished: boolean;
  isFeatured: boolean;
  isActive: boolean;
  thumbnail?: File | null;
}

interface BlogFormProps {
  initialData?: {
    title: string;
    content: string;
    categoryId: number;
    isPublished: boolean;
    isFeatured: boolean;
    isDeleted: boolean;
    thumbnailUrl?: string;
  };
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
  submitText?: string;
}

/* ================= COMPONENT ================= */

export default function BlogForm({
  initialData,
  onSubmit,
  onCancel,
  submitText = "Lưu blog",
}: BlogFormProps) {
  /* ================= STATE ================= */

  const [form, setForm] = useState<BlogFormData>({
    title: "",
    content: "",
    categoryId: 0,
    isPublished: false,
    isFeatured: false,
    isActive: true,
    thumbnail: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= INIT DATA ================= */

  useEffect(() => {
    if (!initialData) return;

    setForm({
      title: initialData.title,
      content: initialData.content,
      categoryId: initialData.categoryId,
      isPublished: initialData.isPublished,
      isFeatured: initialData.isFeatured,
      isActive: !initialData.isDeleted,
      thumbnail: null,
    });

    setPreview(initialData.thumbnailUrl ?? null);
  }, [initialData]);

  useEffect(() => {
    getBlogCategories()
      .then(setCategories)
      .catch(() => toast.error("Không tải được thể loại blog"));
  }, []);

  /* ================= HANDLERS ================= */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, type, value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      categoryId: Number(e.target.value),
    }));
  };

  const handleContentChange = useCallback((html: string) => {
    setForm((prev) => ({ ...prev, content: html }));
  }, []);

  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Ảnh đại diện phải là file hình ảnh");
      return;
    }

    setForm((prev) => ({ ...prev, thumbnail: file }));
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // FE VALIDATION
    if (!form.title.trim()) {
      toast.error("Tiêu đề không được để trống");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Nội dung không được để trống");
      return;
    }

    if (!initialData && !form.thumbnail) {
      toast.error("Vui lòng chọn ảnh đại diện");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= RENDER ================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-sm">
      {/* TITLE */}
      <div>
        <label className="mb-1 block font-medium">Tiêu đề</label>
        <input
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="Nhập tiêu đề blog"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {/* CATEGORY */}
      <div>
        <label className="mb-1 block font-medium">Thể loại</label>
        <select
          value={form.categoryId}
          onChange={handleSelectChange}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value={0} disabled>
            -- Chọn thể loại --
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* CONTENT */}
      <div>
        <label className="mb-1 block font-medium">Nội dung</label>
        <RichTextEditor
          value={form.content}
          onChange={handleContentChange}
        />
      </div>

      {/* THUMBNAIL */}
      <div>
        <label className="mb-1 block font-medium">Ảnh đại diện</label>
        <input type="file" accept="image/*" onChange={handleThumbnailChange} />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-3 h-24 w-24 rounded-lg border object-cover"
          />
        )}
      </div>

      {/* OPTIONS */}
      <div className="flex gap-8">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleInputChange}
          />
          Xuất bản
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleInputChange}
          />
          Nổi bật
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleInputChange}
          />
          Hoạt động
        </label>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2"
        >
          Hủy
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`rounded-lg px-4 py-2 text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {isSubmitting ? "Đang xử lý..." : submitText}
        </button>
      </div>
    </form>
  );
}
