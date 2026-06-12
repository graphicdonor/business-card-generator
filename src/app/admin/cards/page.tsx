"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Trash2, CreditCard } from "lucide-react";

interface CardRow {
  id: string;
  name: string;
  template_id: string | null;
  created_at: string;
  profiles: { email: string | null } | null;
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<CardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCards = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("business_cards")
      .select("id, name, template_id, created_at, profiles(email)")
      .order("created_at", { ascending: false })
      .limit(500);

    setCards((data as unknown as CardRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.profiles?.email?.toLowerCase().includes(q) ||
        c.template_id?.toLowerCase().includes(q)
    );
  }, [cards, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this card? This cannot be undone.")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("business_cards")
      .delete()
      .eq("id", id);
    if (!error) {
      setCards((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete card.");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Cards</h1>
        <p className="text-slate-400 text-sm mt-1">
          {cards.length} cards total
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
          placeholder="Search card name or user email…"
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
                    Card
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden sm:table-cell">
                    Template
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">
                    Owner
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden md:table-cell">
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
                      colSpan={5}
                      className="text-center text-slate-400 py-10"
                    >
                      No cards found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((card) => (
                    <tr key={card.id} className="transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCard size={14} className="text-white" />
                          </div>
                          <span className="font-medium text-white">
                            {card.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden sm:table-cell">
                        {card.template_id || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-300">
                        {card.profiles?.email ?? "unknown"}
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden md:table-cell">
                        {new Date(card.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDelete(card.id)}
                          disabled={deletingId === card.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingId === card.id ? (
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
