"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Contact2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalCards: number;
  totalContacts: number;
  newThisWeek: number;
}

interface RecentUser {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

interface RecentCard {
  id: string;
  name: string;
  template_id: string | null;
  created_at: string;
  profiles: { email: string | null } | null;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCards: 0,
    totalContacts: 0,
    newThisWeek: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentCards, setRecentCards] = useState<RecentCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const [
        { count: totalUsers },
        { count: totalCards },
        { count: totalContacts },
        { count: newThisWeek },
        { data: recentUsersData },
        { data: recentCardsData },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("business_cards")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("contacts")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", oneWeekAgo.toISOString()),
        supabase
          .from("profiles")
          .select("id, full_name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("business_cards")
          .select("id, name, template_id, created_at, profiles(email)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        totalUsers: totalUsers ?? 0,
        totalCards: totalCards ?? 0,
        totalContacts: totalContacts ?? 0,
        newThisWeek: newThisWeek ?? 0,
      });
      setRecentUsers((recentUsersData as RecentUser[]) ?? []);
      setRecentCards((recentCardsData as unknown as RecentCard[]) ?? []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      href: "/admin/users",
      color: "from-rose-500 to-rose-700",
    },
    {
      label: "Total Cards",
      value: stats.totalCards,
      icon: CreditCard,
      href: "/admin/cards",
      color: "from-orange-500 to-orange-700",
    },
    {
      label: "Total Contacts",
      value: stats.totalContacts,
      icon: Contact2,
      href: "/admin/contacts",
      color: "from-amber-500 to-amber-700",
    },
    {
      label: "New This Week",
      value: stats.newThisWeek,
      icon: TrendingUp,
      href: "/admin/users",
      color: "from-pink-500 to-pink-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">
          Platform-wide stats and recent activity
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-slate-800 hover:bg-slate-750 rounded-2xl p-5 flex items-center gap-4 group transition-all border border-slate-700 hover:border-slate-600"
          >
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0`}
            >
              <card.icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-slate-400">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <h2 className="font-semibold text-white text-sm">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-700">
            {recentUsers.length === 0 ? (
              <p className="text-slate-400 text-sm px-5 py-4">No users yet.</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {(user.full_name || user.email || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.full_name || "—"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 flex-shrink-0">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Cards */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
            <h2 className="font-semibold text-white text-sm">Recent Cards</h2>
            <Link
              href="/admin/cards"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-700">
            {recentCards.length === 0 ? (
              <p className="text-slate-400 text-sm px-5 py-4">No cards yet.</p>
            ) : (
              recentCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {card.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {card.profiles?.email ?? "unknown user"}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 flex-shrink-0">
                    {new Date(card.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
        <h2 className="font-semibold text-white text-sm mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Users size={15} /> Manage Users
          </Link>
          <Link
            href="/admin/cards"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <CreditCard size={15} /> Manage Cards
          </Link>
          <Link
            href="/admin/contacts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Contact2 size={15} /> Manage Contacts
          </Link>
        </div>
      </div>
    </div>
  );
}
