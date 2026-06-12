"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Trash2 } from "lucide-react";

interface ContactRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  created_at: string;
  profiles: { email: string | null } | null;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContacts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("contacts")
      .select(
        "id, full_name, email, phone, company, title, created_at, profiles(email)"
      )
      .order("created_at", { ascending: false })
      .limit(500);

    setContacts((data as unknown as ContactRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.profiles?.email?.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact? This cannot be undone.")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (!error) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete contact.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contacts</h1>
        <p className="text-slate-400 text-sm mt-1">
          {contacts.length} contacts total
        </p>
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
                    Contact
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden md:table-cell">
                    Phone
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden lg:table-cell">
                    Company
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden lg:table-cell">
                    Owner
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden xl:table-cell">
                    Created
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
                      colSpan={7}
                      className="text-center text-slate-400 py-10"
                    >
                      No contacts found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((contact) => (
                    <tr key={contact.id} className="transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {(contact.full_name || "C")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-white">
                            {contact.full_name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden sm:table-cell">
                        {contact.email || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden md:table-cell">
                        {contact.phone || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden lg:table-cell">
                        {contact.company || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden lg:table-cell">
                        {contact.profiles?.email ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden xl:table-cell">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDelete(contact.id)}
                          disabled={deletingId === contact.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingId === contact.id ? (
                            <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          Delete
                        </button>
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
