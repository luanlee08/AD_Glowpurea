import { Pencil } from "lucide-react";
import { Blog } from "@/types/blog";

interface BlogTableProps {
    blogs: Blog[];
    loading: boolean;
    onEdit: (blog: Blog) => void;
}

export default function BlogTable({
    blogs,
    loading,
    onEdit,
}: BlogTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] text-sm">
                <thead>
                    <tr className="border-b text-left text-gray-500">
                        <th className="w-16">ID</th>
                        <th className="w-60">Tiêu đề</th>
                        <th className="w-[360px]">Nội dung</th>
                        <th className="w-20">Ảnh</th>
                        <th className="w-32">Thể loại</th>
                        <th className="w-32">Trạng thái</th>
                        <th className="w-24">Nổi bật</th>
                        <th className="w-28">Hoạt động</th>
                        <th className="w-28">Ngày tạo</th>
                        <th className="w-20 text-right pr-4">Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={10} className="py-8 text-center text-gray-500">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        blogs.map((b) => (
                            <tr key={b.id} className="border-b hover:bg-gray-50">
                                <td>{b.id}</td>
                                <td className="font-medium">{b.title}</td>
                                <td
                                    className="max-w-[400px] truncate text-sm text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: b.content }}
                                />

                                <td>
                                    <img
                                        src={b.thumbnail}
                                        className="h-10 w-10 rounded object-cover"
                                        alt=""
                                    />
                                </td>

                                <td>{b.category}</td>

                                <td>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs ${b.status === "Đã xuất bản"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {b.status}
                                    </span>
                                </td>

                                <td className={b.featured ? "text-amber-600" : "text-gray-400"}>
                                    {b.featured ? "Nổi bật" : "Không"}
                                </td>

                                <td>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs ${b.isDeleted
                                            ? "bg-red-100 text-red-700"
                                            : "bg-emerald-100 text-emerald-700"
                                            }`}
                                    >
                                        {b.isDeleted ? "Đã xoá" : "Hoạt động"}
                                    </span>
                                </td>

                                <td>{b.createdAt}</td>

                                <td className="text-right pr-4">
                                    <button
                                        onClick={() => onEdit(b)}
                                        className="text-indigo-500 hover:text-indigo-700"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                    {!loading && blogs.length === 0 && (
                        <tr>
                            <td colSpan={10} className="py-8 text-center text-gray-500">
                                Không có blog nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
