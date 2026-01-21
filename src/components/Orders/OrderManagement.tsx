"use client";

import { useEffect, useState } from "react";
import { Search, Pencil, Eye } from "lucide-react";
import { createPortal } from "react-dom";
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

  const ModalPortal = ({ children }: { children: React.ReactNode }) => {
    if (typeof window === "undefined") return null;
    return createPortal(children, document.body);
  };
  /* ===== LOAD ORDERS ===== */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAdminOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ===== SEARCH ===== */
  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toString().includes(search) ||
      o.accountName.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ===== UPDATE STATUS ===== */
  const statusToId: Record<string, number> = {
    Pending: 1,
    Shipped: 2,
    Delivered: 3,
    Confirmed: 4,
    Cancelled: 5,
  };

  const statusIdToName: Record<number, string> = {
    1: "Pending",
    2: "Shipped",
    3: "Delivered",
    4: "Confirmed",
    5: "Cancelled",
  };



  const handleChangeStatus = async (
    orderId: number,
    statusId: number
  ) => {
    try {
      await updateOrderStatus(orderId, statusId);

      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      alert("Cập nhật trạng thái thất bại");
      throw err;
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold">Order Management</h1>

        <input
          placeholder="Search order / customer / email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-lg border px-4"
        />
      </div>

      {loading && <p>Loading...</p>}

      {!loading && (
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
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
                    disabled={o.status === "Confirmed" || o.status === "Cancelled"}
                    onClick={() => {
                      setEditingOrder(o);
                      setEditStatusId(statusToId[o.status]);
                      openEditModal(); // 🔥 mở modal
                    }}
                    className={`text-gray-500 hover:text-black
                      ${(o.status === "Confirmed" || o.status === "Cancelled")
                      && "opacity-40 cursor-not-allowed hover:text-gray-500"}
                    `}
                  >
                    <Pencil size={16} />
                  </button>

                </td>


              </tr>
            ))}
          </tbody>
        </table>
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
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value={1}>Pending</option>
                  <option value={2}>Shipped</option>
                  <option value={3}>Delivered</option>
                  <option value={4}>Confirmed</option>
                  <option value={5}>Cancelled</option>
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
                disabled={editStatusId === statusToId[editingOrder.status]}
                className={`rounded-lg px-4 py-2 text-sm text-white
            ${editStatusId === statusToId[editingOrder.status]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black"}
          `}
                onClick={async () => {
                  await handleChangeStatus(
                    editingOrder.orderId,
                    editStatusId
                  );
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
