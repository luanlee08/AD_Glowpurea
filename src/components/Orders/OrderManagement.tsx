"use client";

import { useEffect, useState } from "react";
import { Search, Pencil, Eye } from "lucide-react";
import { getAdminOrders, updateOrderStatus, getAdminOrderDetail } from "../../../services/order.service";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

/* ================= TYPES ================= */

interface AdminOrder {
  orderId: number;
  accountId: number;
  accountName: string;
  email: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface AdminOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface AdminOrderDetail {
  orderId: number;
  customerName: string;
  email: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: AdminOrderItem[];
}

/* ================= PAGE ================= */

export default function OrderManagement() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [editStatusId, setEditStatusId] = useState<number>(0);
  const [viewOrder, setViewOrder] = useState<AdminOrderDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const {
    isOpen: isViewOpen,
    openModal: openViewModal,
    closeModal: closeViewModal,
  } = useModal();
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const statusOptions = [
    { id: 3, name: "Pending" },
    { id: 4, name: "Confirmed" },
    { id: 5, name: "Shipped" },
    { id: 6, name: "Delivered" },
    { id: 7, name: "Cancelled" },
  ];

  const statusClass = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Confirmed": return "bg-green-100 text-green-700";
      case "Shipped": return "bg-blue-100 text-blue-700";
      case "Delivered": return "bg-indigo-100 text-indigo-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      default: return "";
    }
  };

  const getStatusIdByName = (name: string) =>
    statusOptions.find(s => s.name === name)?.id ?? 0;



  /* ===== LOAD ORDERS ===== */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAdminOrders(page, pageSize);

        setOrders(res.data);
        setTotal(res.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, pageSize]);


  /* ===== SEARCH ===== */
  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toString().includes(search) ||
      o.accountName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ===== UPDATE STATUS ===== */


  const handleChangeStatus = async (
    orderId: number,
    statusId: number
  ) => {
    try {
      await updateOrderStatus(orderId, statusId);

      const res = await getAdminOrders(page, pageSize);
      setOrders(res.data);
      setTotal(res.total);

    } catch (err) {
      alert("Cập nhật trạng thái thất bại");
      throw err;
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));


  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold">Quản lí đơn hàng</h1>

        <div className="relative w-[320px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Tìm kiếm đơn hàng, khách hàng, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
      h-10 w-full
      rounded-lg border border-gray-300
      pl-10 pr-4
      text-sm
      placeholder:text-gray-400
      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
      outline-none
      transition
    "
          />
        </div>

      </div>

      {loading && <p>Đang tải...</p>}

      {!loading && (
        <>
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-4 py-2">Đơn hàng</th>
                <th className="px-4 py-2">Khách hàng</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Tổng đơn hàng</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2 text-center">Thao tác</th>
              </tr>
            </thead>


            <tbody>
              {filteredOrders.map((o) => (
                <tr
                  key={o.orderId}
                  className="bg-white rounded-lg shadow-sm"
                >
                  <td className="px-4 py-3 font-medium">ORD{o.orderId}</td>
                  <td className="px-4 py-3">{o.accountName}</td>
                  <td className="px-4 py-3">{o.email}</td>
                  <td className="px-4 py-3">
                    {o.totalAmount.toLocaleString("vi-VN")} đ
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold
                    ${o.status === "Pending" && "bg-yellow-100 text-yellow-700"}
                    ${o.status === "Shipped" && "bg-blue-100 text-blue-700"}
                    ${o.status === "Delivered" && "bg-indigo-100 text-indigo-700"}
                    ${o.status === "Confirmed" && "bg-green-100 text-green-700"}
                    ${o.status === "Cancelled" && "bg-red-100 text-red-700"}
                  `}
                    >
                      {o.status}
                    </span>

                  </td>


                  <td>
                    {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-center flex justify-center gap-3">
                    {/* VIEW DETAIL */}
                    <button
                      onClick={async () => {
                        try {
                          setViewLoading(true);
                          const detail = await getAdminOrderDetail(o.orderId);
                          setViewOrder(detail);
                          openViewModal(); // 🔥 mở modal
                        } catch {
                          alert("Không tải được chi tiết đơn hàng");
                        } finally {
                          setViewLoading(false);
                        }
                      }}
                    >
                      <Eye size={16} />
                    </button>


                    {/* EDIT STATUS */}
                    <button
                      disabled={o.status === "Cancelled"}
                      onClick={() => {
                        setEditingOrder(o);
                        setEditStatusId(getStatusIdByName(o.status));
                        openEditModal();
                      }}

                      className={`text-gray-500 hover:text-black ${o.status === "Cancelled"
                        ? "opacity-40 cursor-not-allowed hover:text-gray-500"
                        : ""
                        }`}

                    >
                      <Pencil size={16} />
                    </button>

                  </td>


                </tr>

              ))}
            </tbody>
          </table>
          {/* ===== PAGINATION ===== */}
          <div className="mt-6 flex items-center justify-between">
            {/* LEFT INFO */}
            <span className="text-sm text-gray-500">
              Trang {page} / {totalPages} · Tổng {total} sản phẩm
            </span>

            {/* RIGHT CONTROLS */}
            <div className="flex items-center gap-2">
              {/* PREV */}
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="flex h-9 w-9 items-center justify-center rounded border
        disabled:opacity-40"
              >
                ←
              </button>

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, page - 2),
                  Math.min(totalPages, page + 1)
                )
                .map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded border text-sm font-medium
            ${p === page
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "hover:bg-gray-100"
                      }`}
                  >
                    {p}
                  </button>
                ))}

              {/* NEXT */}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="flex h-9 w-9 items-center justify-center rounded border
        disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>

        </>
      )}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          closeEditModal();
          setEditingOrder(null);
        }}
        className="max-w-[420px] rounded-xl bg-white"
      >
        {editingOrder && (
          <div className="flex max-h-[80vh] flex-col">
            {/* ===== HEADER ===== */}
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold">
                Edit Order #{editingOrder.orderId}
              </h3>
            </div>

            {/* ===== BODY ===== */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>

                <select
                  value={editStatusId}
                  onChange={(e) => setEditStatusId(Number(e.target.value))}
                >
                  {statusOptions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>


              </div>
            </div>

            {/* ===== FOOTER ===== */}
            <div className="border-t px-6 py-4 flex justify-end gap-2">
              <button
                className="rounded-lg border px-4 py-2 text-sm"
                onClick={() => {
                  closeEditModal();
                  setEditingOrder(null);
                }}
              >
                Cancel
              </button>

              <button
                disabled={editStatusId === getStatusIdByName(editingOrder.status)}
                className={`rounded-lg px-4 py-2 text-sm text-white
    ${editStatusId === getStatusIdByName(editingOrder.status)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black"
                  }`}
                onClick={async () => {
                  await handleChangeStatus(editingOrder.orderId, editStatusId);
                  closeEditModal();
                  setEditingOrder(null);
                }}
              >
                Save
              </button>

            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isViewOpen}
        onClose={() => {
          closeViewModal();
          setViewOrder(null);
        }}
        className="max-w-[900px] rounded-xl bg-white"
      >
        {viewOrder && (
          <div className="flex max-h-[85vh] flex-col">
            {/* ===== HEADER ===== */}
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold">
                Order #{viewOrder.orderId}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(viewOrder.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>

            {/* ===== BODY ===== */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Customer info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium">{viewOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{viewOrder.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    {viewOrder.status}
                  </span>
                </div>
              </div>

              {/* Items table */}
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-center">Qty</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewOrder.items.map((i) => (
                    <tr key={i.productId} className="border-t">
                      <td className="px-4 py-2">{i.productName}</td>
                      <td className="px-4 py-2 text-center">{i.quantity}</td>
                      <td className="px-4 py-2 text-right">
                        {i.unitPrice.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {i.total.toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ===== FOOTER ===== */}
            <div className="border-t px-6 py-4 flex justify-between">
              <span className="text-sm text-gray-500">Total amount</span>
              <span className="text-lg font-bold">
                {viewOrder.totalAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
