"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  CreditCard,
  Plus,
  TrendingUp,
  ArrowRight,
  Calendar,
} from "lucide-react";

interface Stats {
  contacts: number;
  cards: number;
  recentContacts: Array<{
    id: string;
    full_name: string;
    company: string | null;
    email: string | null;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ contacts: 0, cards: 0, recentContacts: [] });
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserName(user.user_metadata?.full_name ?? user.email ?? "");

      const [{ count: contactCount }, { count: cardCount }, { data: recent }] = await Promise.all([
        supabase.from("contacts").select("*", { count: "exact", head: true }),
        supabase.from("business_cards").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("id, full_name, company, email, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        contacts: contactCount ?? 0,
        cards: cardCount ?? 0,
        recentContacts: recent ?? [],
      });
      setLoading(false);
    };
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">
          {greeting()}{userName ? `, ${userName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Here&apos;s what&apos;s happening with your cards and contacts.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users size={16} className="text-blue-600" />
            </div>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{loading ? "—" : stats.contacts}</p>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Contacts</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
              <CreditCard size={16} className="text-violet-600" />
            </div>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{loading ? "—" : stats.cards}</p>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Saved Cards</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl shadow-sm p-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">Quick actions</p>
          <div className="space-y-2">
            <Link
              href="/dashboard/contacts/new"
              className="flex items-center gap-2 text-white text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              <Plus size={14} />
              Add contact
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-white/70 text-sm font-medium hover:opacity-80 transition-opacity"
            >
              <Plus size={14} />
              Create card
            </Link>
          </div>
        </div>
      </div>

      {/* Recent contacts */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <h2 className="text-sm font-bold text-slate-900">Recent Contacts</h2>
          <Link
            href="/dashboard/contacts"
            className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center text-sm text-slate-400">Loading...</div>
        ) : stats.recentContacts.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users size={20} className="text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 mb-3">No contacts yet</p>
            <Link
              href="/dashboard/contacts/new"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Plus size={14} />
              Add your first contact
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {stats.recentContacts.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/contacts/${c.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {c.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{c.full_name}</p>
                  <p className="text-xs text-slate-400 truncate">{c.company || c.email || ""}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0">
                  <Calendar size={11} />
                  <span className="text-[10px]">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
