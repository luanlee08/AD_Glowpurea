/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import RichTextEditor from "@/components/editors/RichTextEditor";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, getShapes } from "../../../services/lookup.service";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

export interface ProductFormData {
  name: string;
  quantity: number;
  price: number;
  description: string;
  status: "Available" | "OutOfStock" | "Discontinued";
  categoryId: number | "";
  shapeId: number | "";
  mainImage: File | null;
  subImages: File[];

  // dùng cho EDIT
  mainImageUrl?: string | null;
  subImageUrls?: string[];
}

interface Props {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  initialData?: ProductFormData | null;
}

interface OptionItem {
  id: number;
  name: string;
}

/* ================= COMPONENT ================= */

export default function ProductForm({
  onSubmit,
  onCancel,
  initialData,
}: Props) {
  /* ================= STATE ================= */

  const [form, setForm] = useState<ProductFormData>({
    name: "",
    quantity: 0,
    price: 0,
    description: "",
    status: "Available",
    categoryId: "",
    shapeId: "",
    mainImage: null,
    subImages: [],
  });

  const [categories, setCategories] = useState<OptionItem[]>([]);
  const [shapes, setShapes] = useState<OptionItem[]>([]);

  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [subPreviews, setSubPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= LOAD DATA EDIT ================= */

  useEffect(() => {
    if (!initialData) return;

    setForm({
      ...initialData,
      mainImage: null,
      subImages: [],
    });

    setMainPreview(initialData.mainImageUrl ?? null);
    setSubPreviews(initialData.subImageUrls ?? []);
  }, [initialData]);

  /* ================= LOAD CATEGORY & SHAPE ================= */

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [catRes, shapeRes] = await Promise.all([
          getCategories(),
          getShapes(),
        ]);
        setCategories(catRes);
        setShapes(shapeRes);
      } catch (err) {
        console.error("Load lookup failed", err);
      }
    };

    fetchLookups();
  }, []);

  /* ================= CLEANUP PREVIEW ================= */

  useEffect(() => {
    return () => {
      if (mainPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(mainPreview);
      }
      subPreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [mainPreview, subPreviews]);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((p) => ({
      ...p,
      [name]:
        name === "categoryId" || name === "shapeId"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((p) => ({ ...p, mainImage: file }));
    setMainPreview(URL.createObjectURL(file));
  };

  const handleSubImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    if (newFiles.length > 6) {
      toast.error("Tối đa chỉ được chọn 6 ảnh phụ", {
        id: "subimage-limit",
      });
      return;
    }

    // 🔥 REPLACE hoàn toàn
    setForm((p) => ({ ...p, subImages: newFiles }));
    setSubPreviews(newFiles.map((f) => URL.createObjectURL(f)));

  };

  const removeSubImage = (index: number) => {
    setForm((p) => ({
      ...p,
      subImages: p.subImages.filter((_, i) => i !== index),
    }));
    setSubPreviews((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!form.name.trim()) {
      toast.error("Tên sản phẩm không được để trống", { id: "name-required" });
      return;
    }

    if (form.price <= 0) {
      toast.error("Giá sản phẩm phải lớn hơn 0", { id: "price-invalid" });
      return;
    }

    if (form.quantity < 0) {
      toast.error("Số lượng không hợp lệ", { id: "quantity-invalid" });
      return;
    }

    if (!form.categoryId) {
      toast.error("Vui lòng chọn phân loại", { id: "category-required" });
      return;
    }

    if (!form.shapeId) {
      toast.error("Vui lòng chọn loại sản phẩm", { id: "shape-required" });
      return;
    }

    if (!initialData && !form.mainImage) {
      toast.error("Vui lòng chọn ảnh chính", { id: "main-image-required" });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(form);

      toast.success(
        initialData
          ? "Cập nhật sản phẩm thành công"
          : "Tạo sản phẩm thành công"
      );
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSubmitting(false);
    }
  };


  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* NAME */}
      <div>
        <label className="mb-1 block text-sm font-medium">Tên sản phẩm</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      {/* PRICE & QUANTITY */}
      <div className="grid grid-cols-2 gap-4">
        {/* CỘT GIÁ */}
        <div>
          <label className="mb-1 block text-sm font-medium">Giá</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        {/* CỘT SỐ LƯỢNG */}
        <div>
          <label className="mb-1 block text-sm font-medium">Số lượng</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
      </div>


      {/* CATEGORY & SHAPE */}
      <div className="grid grid-cols-2 gap-4">
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">-- Chọn phân loại --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="shapeId"
          value={form.shapeId}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">-- Chọn loại --</option>
          {shapes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* STATUS */}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        <option value="Available">Còn hàng</option>
        <option value="OutOfStock">Hết hàng</option>
        <option value="Discontinued">Ngừng kinh doanh</option>
      </select>

      {/* DESCRIPTION */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Mô tả sản phẩm
        </label>

        <RichTextEditor
          value={form.description}
          onChange={(html) =>
            setForm((prev) => ({
              ...prev,
              description: html,  
            }))
          }
        />
      </div>

      {/* MAIN IMAGE */}
      <input type="file" accept="image/*" onChange={handleMainImage} />
      {mainPreview && (
        <img
          src={mainPreview}
          className="mt-2 h-32 w-32 rounded border object-cover"
        />
      )}

      {/* SUB IMAGES */}
      <input type="file" multiple accept="image/*" onChange={handleSubImages} />
      {subPreviews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {subPreviews.map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                className="h-24 w-full rounded border object-cover"
              />
              <button
                type="button"
                onClick={() => removeSubImage(i)}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="rounded border px-4 py-2 text-sm">
          Hủy
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className={`rounded px-5 py-2 text-sm text-white ${isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600"
            }`}
        >
          {isSubmitting ? "Đang xử lý..." : "Lưu sản phẩm"}
        </button>

      </div>
    </div>
  );
}
