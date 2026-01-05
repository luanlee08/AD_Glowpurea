"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
} from "../../../services/product.service";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Search, Pencil, Plus } from "lucide-react";
import ProductForm, { ProductFormData } from "@/components/Products/ProductForm";

/* ================= TYPES ================= */

interface Product {
  productId: number;
  sku: string;
  name: string;
  category: string;
  shape: string;
  image: string;
  price: number;
  quantity: number;
  status: "Available" | "OutOfStock" | "Discontinued";
  createdAt: string;
}

/* ================= COMPONENT ================= */

export default function ProductManagement() {
  const { isOpen, openModal, closeModal } = useModal();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // EDIT STATE
  const [editingId, setEditingId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<ProductFormData | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  /* ================= FETCH ================= */

  const fetchProducts = async () => {
    const res = await getProducts({ keyword: search, page, pageSize });

    const mapped: Product[] = res.data.map((p: any) => ({
      productId: p.productId ?? p.productID ?? p.id,
      sku: p.sku,
      name: p.productName,
      category: p.categoryName ?? "-",
      shape: p.shapesName ?? "-",
      image: p.mainImageUrl ?? "/images/no-image.png",
      price: p.price,
      quantity: p.quantity,
      status: p.productStatus,
      createdAt: p.createdAt?.split("T")[0] ?? "-",
    }));

    setProducts(mapped);
    setTotal(res.total);
  };

  useEffect(() => {
    const t = setTimeout(fetchProducts, 400);
    return () => clearTimeout(t);
  }, [search, page]);

  /* ================= CREATE ================= */

  const handleCreateProduct = async (data: ProductFormData) => {
    const fd = new FormData();

    fd.append("ProductName", data.name);
    fd.append("CategoryId", String(data.categoryId));
    fd.append("ShapesId", String(data.shapeId));
    fd.append("Price", String(data.price));
    fd.append("Quantity", String(data.quantity));
    fd.append("ProductStatus", data.status);

    if (data.description) fd.append("Description", data.description);
    if (data.mainImage) fd.append("MainImage", data.mainImage);
    data.subImages.forEach((f) => fd.append("SubImages", f));

    await createProduct(fd);
    closeModal();
    fetchProducts();
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async (data: ProductFormData) => {
    if (!editingId) return;

    const fd = new FormData();

    fd.append("ProductName", data.name);
    fd.append("CategoryId", String(data.categoryId));
    fd.append("ShapesId", String(data.shapeId));
    fd.append("Price", String(data.price));
    fd.append("Quantity", String(data.quantity));
    fd.append("ProductStatus", data.status);

    if (data.description) fd.append("Description", data.description);
    if (data.mainImage) fd.append("NewMainImage", data.mainImage);
    data.subImages.forEach((f) => fd.append("NewSubImages", f));

    await updateProduct(editingId, fd);
    closeModal();
    setEditingId(null);
    setInitialData(null);
    fetchProducts();
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      {/* HEADER */}
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded bg-indigo-500 px-4 py-2 text-white"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </button>

      </div>

      {/* TABLE */}
      <table className="w-full text-sm border-separate border-spacing-y-3">
        <thead>
          <tr className="text-gray-600">
            <th className="px-3 py-2 text-left w-[110px]">Mã SKU</th>
            <th className="px-3 py-2 text-left">Tên sản phẩm</th>
            <th className="px-3 py-2 text-center w-[90px]">Hình ảnh</th>
            <th className="px-3 py-2 text-left w-[160px]">Danh mục</th>
            <th className="px-3 py-2 text-left w-[90px]">Dạng</th>
            <th className="px-3 py-2 text-right w-[110px]">Giá</th>
            <th className="px-3 py-2 text-right w-[90px]">Tồn kho</th>
            <th className="px-3 py-2 text-center w-[140px]">Trạng thái</th>
            <th className="px-3 py-2 text-center w-[80px]">Thao tác</th>
          </tr>
        </thead>


        <tbody>
          {products.map((p) => (
            <tr
              key={p.productId}
              className="bg-white rounded-lg shadow-sm hover:bg-gray-50"
            >
              <td className="px-3 py-2 font-medium">{p.sku}</td>

              <td className="px-3 py-2">{p.name}</td>

              <td className="px-3 py-2 text-center">
                <img
                  src={p.image}
                  className="h-10 w-10 mx-auto object-cover rounded cursor-pointer"
                  onClick={() => setPreviewImage(p.image)}
                />
              </td>

              <td className="px-3 py-2">{p.category}</td>

              <td className="px-3 py-2">{p.shape}</td>

              <td className="px-3 py-2 text-right font-semibold">
                {p.price.toLocaleString()}
              </td>

              <td className="px-3 py-2 text-right">{p.quantity}</td>

              <td className="px-3 py-2 text-center">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium
              ${p.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : p.status === "OutOfStock"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
            `}
                >
                  {p.status === "Available"
                    ? "Còn hàng"
                    : p.status === "OutOfStock"
                      ? "Hết hàng"
                      : "Ngừng kinh doanh"}
                </span>
              </td>

              <td className="px-3 py-2 text-center">
                <button
                  className="p-2 rounded hover:bg-gray-200"
                  onClick={async () => {
                    const res = await getProductById(p.productId);

                    setInitialData({
                      name: res.productName,
                      price: res.price,
                      quantity: res.quantity,
                      description: res.description ?? "",
                      status: res.productStatus,
                      categoryId: res.categoryId,
                      shapeId: res.shapesId,
                      mainImage: null,
                      subImages: [],
                      mainImageUrl: res.mainImageUrl,
                      subImageUrls: res.subImageUrls,
                    });

                    setEditingId(p.productId);
                    openModal();
                  }}
                >
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <div className="text-gray-500">
  Trang <span className="font-medium">{page}</span> /
  <span className="font-medium"> {totalPages}</span> ·
  Tổng <span className="font-medium"> {total}</span> sản phẩm
</div>


        <div className="flex items-center gap-2">
          {/* PREV */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`rounded px-3 py-1 border
        ${page === 1
                ? "cursor-not-allowed text-gray-400"
                : "hover:bg-gray-100"
              }
      `}
          >
            ←
          </button>

          {/* PAGE NUMBERS */}
          {Array.from({ length: totalPages })
            .slice(
              Math.max(0, page - 3),
              Math.min(totalPages, page + 2)
            )
            .map((_, i) => {
              const pageNumber = i + Math.max(1, page - 2);

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`rounded px-3 py-1 border
              ${page === pageNumber
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "hover:bg-gray-100"
                    }
            `}
                >
                  {pageNumber}
                </button>
              );
            })}

          {/* NEXT */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`rounded px-3 py-1 border
        ${page === totalPages
                ? "cursor-not-allowed text-gray-400"
                : "hover:bg-gray-100"
              }
      `}
          >
            →
          </button>
        </div>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div
          className="
    w-full
    max-w-[720px]
    max-h-[85vh]
    overflow-y-auto
    rounded-2xl
    bg-white
    p-6
    mx-auto
  "
        >
          <ProductForm
            onCancel={closeModal}
            onSubmit={editingId ? handleUpdate : handleCreateProduct}
            initialData={initialData}
          />
        </div>
      </Modal>

    </div>
  );
}
