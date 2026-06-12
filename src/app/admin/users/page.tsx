"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Search, Eye, Trash2 } from "lucide-react";

interface UserRow {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  is_admin: boolean | null;
  created_at: string;
  card_count: number;
  contact_count: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    const supabase = createClient();

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, company, is_admin, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!profiles) {
      setLoading(false);
      return;
    }

    // Fetch card counts and contact counts for all users
    const ids = profiles.map((p) => p.id);

    const [{ data: cards }, { data: contacts }] = await Promise.all([
      supabase
        .from("business_cards")
        .select("user_id")
        .in("user_id", ids),
      supabase
        .from("contacts")
        .select("user_id")
        .in("user_id", ids),
    ]);

    const cardCounts: Record<string, number> = {};
    const contactCounts: Record<string, number> = {};

    (cards ?? []).forEach((c) => {
      cardCounts[c.user_id] = (cardCounts[c.user_id] ?? 0) + 1;
    });
    (contacts ?? []).forEach((c) => {
      contactCounts[c.user_id] = (contactCounts[c.user_id] ?? 0) + 1;
    });

    setUsers(
      profiles.map((p) => ({
        ...p,
        card_count: cardCounts[p.id] ?? 0,
        contact_count: contactCounts[p.id] ?? 0,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.company?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user and all their data? This cannot be undone."))
      return;
    setDeletingId(id);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        const body = await res.json();
        alert(body.error ?? "Failed to delete user.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">
            {users.length} registered users
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search name, email or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">
                    User
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden md:table-cell">
                    Company
                  </th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium">
                    Cards
                  </th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium hidden sm:table-cell">
                    Contacts
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden lg:table-cell">
                    Joined
                  </th>
                  <th className="px-5 py-3 text-slate-400 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-slate-400 py-10"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-750 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {(user.full_name || user.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate max-w-[140px]">
                              {user.full_name || "—"}
                            </p>
                            <p className="text-xs text-slate-400 truncate max-w-[140px]">
                              {user.email}
                            </p>
                          </div>
                          {user.is_admin && (
                            <span className="text-[10px] bg-rose-600/20 text-rose-400 border border-rose-600/30 rounded px-1.5 py-0.5 flex-shrink-0">
                              admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-300 hidden md:table-cell">
                        {user.company || "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-300">
                        {user.card_count}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-300 hidden sm:table-cell">
                        {user.contact_count}
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden lg:table-cell">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                          >
                            <Eye size={12} /> View
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={deletingId === user.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingId === user.id ? (
                              <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={12} />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
