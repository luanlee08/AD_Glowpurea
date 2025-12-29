"use client";

import { useEffect, useState } from "react";
import { getProducts, type ProductApi } from "../../../services/product.service";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

/* ================= TYPES ================= */

interface Product {
  id: string;
  name: string;
  category: string;
  shape: string;
  image: string;
  price: number;
  quantity: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

/* ================= COMPONENT ================= */

export default function ProductManagement() {
  const { isOpen, openModal, closeModal } = useModal();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: ProductApi[] = await getProducts();

        const mapped: Product[] = data.map((p: ProductApi) => ({
          id: p.sku,
          name: p.productName,
          category: p.categoryName ?? "-",
          shape: p.shapesName ?? "-",
          image: p.mainImageUrl ?? "/images/no-image.png",
          price: p.price,
          quantity: p.quantity,
          status: p.productStatus === "Available" ? "Active" : "Inactive",
          createdAt: p.createdAt
            ? p.createdAt.split("T")[0]
            : "-",
        }));

        setProducts(mapped);
      } catch (err) {
        console.error("Load products failed", err);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FILTER ================= */

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="rounded-2xl bg-white p-6 text-gray-800 shadow-theme-xl dark:bg-slate-900 dark:text-white">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage products, pricing and inventory
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-lg pl-9 pr-4 text-sm border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* ADD */}
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <th className="py-3">SKU</th>
              <th>Name</th>
              <th>Image</th>
              <th>Category</th>
              <th>Shape</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
              >
                <td className="py-4 text-xs text-gray-500">{p.id}</td>
                <td
                  className="max-w-[280px] whitespace-normal break-words line-clamp-2"
                  title={p.name}
                >
                  {p.name}
                </td>
                  <td>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                </td>

                <td>{p.category}</td>
                <td>{p.shape}</td>
                <td className="font-semibold">${p.price}</td>
                <td>{p.quantity}</td>

                <td>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${p.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="text-xs text-gray-500">{p.createdAt}</td>

                <td className="text-right pr-6">
                  <div className="inline-flex items-center gap-3">
                    <button className="text-indigo-500 hover:text-indigo-700">
                      <Pencil size={16} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] rounded-xl bg-white p-6 dark:bg-slate-900"
      >
        <h3 className="mb-4 text-lg font-semibold">Add / Edit Product</h3>
        <p className="text-sm text-gray-500">
          (Bạn có thể mở rộng form tại đây)
        </p>
      </Modal>
    </div>
  );
}
