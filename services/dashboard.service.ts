const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001";

export async function getAdminDashboard() {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    throw new Error("No admin token");
  }

  const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return res.json();
}
