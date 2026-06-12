"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, Plus, Trash2, Edit2, Calendar, Loader2 } from "lucide-react";

interface SavedCard {
  id: string;
  name: string;
  template_id: string;
  card_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export default function CardsPage() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("business_cards")
      .select("id, name, template_id, card_data, created_at, updated_at")
      .order("updated_at", { ascending: false });
    setCards(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this saved card?")) return;
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from("business_cards").delete().eq("id", id);
    await load();
    setDeletingId(null);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Cards</h1>
          <p className="text-slate-400 text-sm mt-0.5">{cards.length} saved</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Card</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-14 text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium mb-1">No saved cards yet</p>
          <p className="text-slate-400 text-sm mb-5">Create a business card and save it to your account</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus size={14} />
            Create your first card
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md hover:border-slate-200 transition-all"
            >
              {/* Card preview placeholder */}
              <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-3 left-4 w-16 h-1 bg-white rounded" />
                  <div className="absolute top-6 left-4 w-10 h-0.5 bg-white rounded" />
                  <div className="absolute bottom-4 right-4 w-10 h-10 border border-white/30 rounded" />
                </div>
                <CreditCard size={28} className="text-white/30" />
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider truncate">
                    {(card.card_data as { fullName?: string }).fullName || card.name}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-900 truncate mb-0.5">{card.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar size={10} />
                  Updated {new Date(card.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>

              <div className="px-4 pb-4 flex gap-2">
                <Link
                  href={`/?cardId=${card.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 text-slate-500 text-xs font-semibold py-2 rounded-xl transition-colors"
                >
                  <Edit2 size={12} />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(card.id)}
                  disabled={deletingId === card.id}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                >
                  {deletingId === card.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
