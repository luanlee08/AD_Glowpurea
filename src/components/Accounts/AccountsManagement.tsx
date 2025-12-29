"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

interface Account {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  role: "Admin" | "Staff" | "Customer";
  status: "Active" | "Inactive";
  createdAt: string;
}

export default function AccountManagement() {
  const { isOpen, openModal, closeModal } = useModal();
  const [search, setSearch] = useState("");

  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "ACC001",
      avatar: "/images/avatar-1.png",
      fullName: "Nguyen Van A",
      email: "a@gmail.com",
      role: "Admin",
      status: "Active",
      createdAt: "2024-06-01",
    },
    {
      id: "ACC002",
      avatar: "/images/avatar-2.png",
      fullName: "Tran Thi B",
      email: "b@gmail.com",
      role: "Customer",
      status: "Inactive",
      createdAt: "2024-06-05",
    },
  ]);

  const filteredAccounts = accounts.filter(
    (a) =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl bg-white p-6 text-gray-800 shadow-theme-xl dark:bg-slate-900 dark:text-white">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Account Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage user accounts, roles and status
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search by name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-10 rounded-lg pl-9 pr-4 text-sm
                border border-gray-300 bg-white
                dark:border-gray-700 dark:bg-gray-800
              "
            />
          </div>

          {/* ADD */}
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
          >
            <Plus size={16} />
            Add Account
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <th className="py-3">ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAccounts.map((a) => (
              <tr
                key={a.id}
                className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
              >
                {/* ID */}
                <td className="py-4 text-xs text-gray-500 dark:text-gray-400">
                  {a.id}
                </td>

                {/* USER */}
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={a.avatar}
                      alt={a.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{a.fullName}</span>
                  </div>
                </td>

                {/* EMAIL */}
                <td>{a.email}</td>

                {/* ROLE */}
                <td>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
                    {a.role}
                  </span>
                </td>

                {/* STATUS */}
                <td>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      a.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700/30 dark:text-gray-400"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>

                {/* CREATED */}
                <td className="text-xs text-gray-500 dark:text-gray-400">
                  {a.createdAt}
                </td>

                {/* ACTIONS */}
                <td className="text-right pr-6">
                  <div className="inline-flex items-center gap-3">
                    <button className="rounded-md p-1 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-gray-700">
                      <Pencil size={16} />
                    </button>
                    <button className="rounded-md p-1 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredAccounts.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No accounts found
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
        <h3 className="mb-4 text-lg font-semibold">Add / Edit Account</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          (Form thêm/sửa account có thể triển khai ở đây)
        </p>
      </Modal>
    </div>
  );
}
