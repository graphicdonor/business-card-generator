"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Users, Plus, Search, Phone, Mail, Building2, ArrowRight } from "lucide-react";

interface Contact {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  created_at: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("contacts")
        .select("id, full_name, email, phone, company, title, created_at")
        .order("full_name");
      setContacts(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = contacts.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Contacts</h1>
          <p className="text-slate-400 text-sm mt-0.5">{contacts.length} total</p>
        </div>
        <Link
          href="/dashboard/contacts/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Contact</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium mb-1">
              {query ? "No contacts found" : "No contacts yet"}
            </p>
            <p className="text-slate-400 text-sm mb-4">
              {query ? "Try a different search term" : "Start building your network"}
            </p>
            {!query && (
              <Link
                href="/dashboard/contacts/new"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Plus size={14} />
                Add your first contact
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/contacts/${c.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {c.full_name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{c.full_name}</p>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {c.title && c.company && (
                      <span className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[180px]">
                        <Building2 size={10} className="flex-shrink-0" />
                        {c.title}, {c.company}
                      </span>
                    )}
                    {!c.title && c.company && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Building2 size={10} className="flex-shrink-0" />
                        {c.company}
                      </span>
                    )}
                    {c.email && (
                      <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1 truncate max-w-[200px]">
                        <Mail size={10} className="flex-shrink-0" />
                        {c.email}
                      </span>
                    )}
                    {c.phone && (
                      <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1">
                        <Phone size={10} className="flex-shrink-0" />
                        {c.phone}
                      </span>
                    )}
                  </div>
                </div>

                <ArrowRight size={15} className="text-slate-300 group-hover:text-blue-400 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
