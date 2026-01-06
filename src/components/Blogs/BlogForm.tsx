"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/editors/RichTextEditor";

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
  onSubmit: (data: BlogFormData) => Promise<void> | void;
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

  const [form, setForm] = useState<BlogFormData>(() => ({
    title: initialData?.title ?? "",
    content: initialData?.content ?? "",
    categoryId: initialData?.categoryId ?? 1,
    isPublished: initialData?.isPublished ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    isActive: initialData
      ? !initialData.isDeleted
      : true,
    thumbnail: null,
  }));

  const [preview, setPreview] = useState<string | null>(
    initialData?.thumbnailUrl ?? null
  );
  useEffect(() => {
    console.log("FORM INIT CATEGORY:", initialData?.categoryId);
  }, [initialData]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= HANDLERS ================= */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };
  useEffect(() => {
    if (!initialData) return;

    setForm({
      title: initialData.title,
      content: initialData.content,
      categoryId: initialData.categoryId, // ⭐ QUAN TRỌNG
      isPublished: initialData.isPublished,
      isFeatured: initialData.isFeatured,
      isActive: !initialData.isDeleted,
      thumbnail: null,
    });

    setPreview(initialData.thumbnailUrl ?? null);
  }, [initialData]);

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      categoryId: Number(e.target.value),
    }));
  };

  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Ảnh đại diện phải là file hình ảnh", {
        id: "thumbnail-invalid",
      });
      return;
    }

    setForm((prev) => ({ ...prev, thumbnail: file }));
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // 🔴 FE VALIDATION
    if (!form.title.trim()) {
      toast.error("Tiêu đề không được để trống", {
        id: "title-required",
      });
      return;
    }

    if (!form.content.trim()) {
      toast.error("Nội dung không được để trống", {
        id: "content-required",
      });
      return;
    }

    if (!initialData && !form.thumbnail) {
      toast.error("Vui lòng chọn ảnh đại diện", {
        id: "thumbnail-required",
      });
      return;
    }

    if (
      initialData &&
      !initialData.thumbnailUrl &&
      !form.thumbnail
    ) {
      toast.error("Vui lòng chọn ảnh đại diện", {
        id: "thumbnail-required",
      });
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
          <option value={1}>Tin tức</option>
          <option value={2}>Sự kiện</option>
          <option value={3}>Sản phẩm</option>
        </select>
      </div>

      {/* CONTENT */}
      <div>
        <label className="mb-1 block font-medium">Nội dung</label>

        <RichTextEditor
          value={form.content}
          onChange={(html) =>
            setForm((prev) => ({
              ...prev,
              content: html,
            }))
          }
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
            className="mt-3 h-24 w-24 rounded-lg object-cover border"
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
      <div className="flex justify-end gap-3 pt-4 border-t">
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
          className={`rounded-lg px-4 py-2 text-white ${isSubmitting
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
