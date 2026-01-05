/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, getShapes } from "../../../services/lookup.service";

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

    const total =
      (initialData?.subImageUrls?.length ?? 0) + newFiles.length;

    if (total > 6) {
      alert("Tổng ảnh phụ tối đa là 6");
      return;
    }

    setForm((p) => ({ ...p, subImages: newFiles }));
    setSubPreviews((p) => [
      ...p,
      ...newFiles.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeSubImage = (index: number) => {
    setForm((p) => ({
      ...p,
      subImages: p.subImages.filter((_, i) => i !== index),
    }));
    setSubPreviews((p) => p.filter((_, i) => i !== index));
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* NAME */}
      <div>
        <label className="mb-1 block text-sm font-medium">Product Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      {/* PRICE & QUANTITY */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      {/* CATEGORY & SHAPE */}
      <div className="grid grid-cols-2 gap-4">
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">-- Select category --</option>
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
          <option value="">-- Select shape --</option>
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
        <option value="Available">Available</option>
        <option value="OutOfStock">Out of stock</option>
        <option value="Discontinued">Discontinued</option>
      </select>

      {/* DESCRIPTION */}
      <textarea
        rows={4}
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full rounded-lg border px-3 py-2 text-sm"
      />

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
          Cancel
        </button>
        <button
          onClick={() => onSubmit(form)}
          className="rounded bg-indigo-500 px-5 py-2 text-sm text-white"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}
