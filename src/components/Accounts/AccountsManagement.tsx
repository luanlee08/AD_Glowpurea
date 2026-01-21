"use client";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Search, Pencil } from "lucide-react";
import {
  getAccounts,
  updateAccountStatus,
  type Account,
  type AccountStatus,
} from "../../../services/account.service";

import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<AccountStatus | "">("");

  const [editing, setEditing] = useState<Account | null>(null);
  const [editStatus, setEditStatus] = useState<AccountStatus>("Active");
  const { isOpen, openModal, closeModal } = useModal();

  const openEdit = (acc: Account) => {
    setEditing(acc);
    setEditStatus(acc.status);
    openModal();
  };

  const handleUpdateStatus = async () => {
    if (!editing) return;

    const toastId = toast.loading("Đang cập nhật trạng thái...");

    try {
      await updateAccountStatus(editing.accountId, editStatus);

      setAccounts((prev) =>
        prev.map((a) =>
          a.accountId === editing.accountId
            ? { ...a, status: editStatus }
            : a
        )
      );

      toast.success("Cập nhật trạng thái tài khoản thành công", {
        id: toastId,
      });

      closeModal();
      setEditing(null);
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    const load = async () => {
      const res = await getAccounts({
        keyword,
        status: status || undefined,
      });

      setAccounts(res?.data ?? []);
    };

    load();
  }, [keyword, status]);

  const renderStatus = (status: AccountStatus) => {
    const map = {
      Active: "bg-green-100 text-green-700",
      Blocked: "bg-red-100 text-red-700",
      Inactive: "bg-gray-200 text-gray-600",
    };

    const label = {
      Active: "Hoạt động",
      Inactive: "Ngừng hoạt động",
      Blocked: "Bị khóa",
    };

    return (
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${map[status]}`}
      >
        {label[status]}
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-theme-xl">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý tài khoản</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tên, email, số điện thoại..."
              className="h-10 w-64 rounded-lg border border-gray-200 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Ngừng hoạt động</option>
            <option value="Blocked">Bị khóa</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-3">Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((a) => (
            <tr
              key={a.accountId}
              className="border-b transition hover:bg-gray-50"
            >
              <td className="py-4 font-medium">{a.accountName}</td>
              <td>{a.email}</td>
              <td>{a.phoneNumber ?? "-"}</td>
              <td className="capitalize">
                {a.roleName ?? "Khách hàng"}
              </td>
              <td>{renderStatus(a.status)}</td>
              <td>{new Date(a.createdAt).toLocaleDateString("vi-VN")}</td>
              <td className="px-3 py-2 text-center">
                <button
                  className="rounded p-2 hover:bg-gray-200"
                  onClick={() => openEdit(a)}
                >
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          closeModal();
          setEditing(null);
        }}
        className="max-w-[480px] rounded-xl bg-white"
      >
        <div className="flex max-h-[85vh] flex-col">
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold">
              Cập nhật trạng thái tài khoản
            </h3>
          </div>

          <div className="flex-1 space-y-4 px-6 py-4">
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Tên tài khoản
              </label>
              <input
                value={editing?.accountName ?? ""}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Email
              </label>
              <input
                value={editing?.email ?? ""}
                disabled
                className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Trạng thái
              </label>
              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as AccountStatus)
                }
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="Active">Hoạt động</option>
                <option value="Inactive">Ngừng hoạt động</option>
                <option value="Blocked">Bị khóa</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              onClick={() => {
                closeModal();
                setEditing(null);
              }}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>

            <button
              onClick={handleUpdateStatus}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
