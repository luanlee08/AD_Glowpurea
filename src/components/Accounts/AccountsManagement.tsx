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

    return (
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${map[status]}`}
      >
        {status}
      </span>
    );
  };
  return (
    <div className="rounded-2xl bg-white p-6 shadow-theme-xl">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Account Management</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search name, email, phone..."
              className="h-10 w-64 rounded-lg border border-gray-200 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>



      {/* TABLE */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-3">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((a) => (
            <tr
              key={a.accountId}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="py-4 font-medium">{a.accountName}</td>
              <td>{a.email}</td>
              <td>{a.phoneNumber ?? "-"}</td>
              <td className="capitalize">{a.roleName ?? "customer"}</td>
              <td>{renderStatus(a.status)}</td>
              <td>
                {new Date(a.createdAt).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 text-center">
                <button
                  className="p-2 rounded hover:bg-gray-200"
                  onClick={() => openEdit(a)}
                >
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          closeModal();
          setEditing(null);
        }}
        className="max-w-[480px] rounded-xl bg-white"
      >
        <div className="flex max-h-[85vh] flex-col">
          {/* HEADER */}
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold">
              Cập nhật trạng thái tài khoản
            </h3>
          </div>

          {/* BODY */}
          <div className="flex-1 space-y-4 px-6 py-4">
            {/* Name */}
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

            {/* Email */}
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

            {/* Status */}
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* FOOTER */}
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
