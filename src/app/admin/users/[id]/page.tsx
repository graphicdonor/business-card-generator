"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Trash2, CreditCard, Contact2 } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  is_admin: boolean | null;
  created_at: string;
}

interface Card {
  id: string;
  name: string;
  template_id: string | null;
  created_at: string;
}

interface Contact {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<"cards" | "contacts">("cards");
  const [loading, setLoading] = useState(true);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const [{ data: profileData }, { data: cardsData }, { data: contactsData }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("id, full_name, email, company, is_admin, created_at")
            .eq("id", userId)
            .single(),
          supabase
            .from("business_cards")
            .select("id, name, template_id, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
          supabase
            .from("contacts")
            .select("id, full_name, email, phone, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
        ]);

      setProfile(profileData);
      setCards(cardsData ?? []);
      setContacts(contactsData ?? []);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Delete this card?")) return;
    setDeletingCardId(cardId);
    const supabase = createClient();
    const { error } = await supabase
      .from("business_cards")
      .delete()
      .eq("id", cardId);
    if (!error) {
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } else {
      alert("Failed to delete card.");
    }
    setDeletingCardId(null);
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm("Delete this contact?")) return;
    setDeletingContactId(contactId);
    const supabase = createClient();
    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", contactId);
    if (!error) {
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
    } else {
      alert("Failed to delete contact.");
    }
    setDeletingContactId(null);
  };

  const handleDeleteUser = async () => {
    if (
      !confirm(
        "Delete this user and ALL their data permanently? This cannot be undone."
      )
    )
      return;
    setDeletingUser(true);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
    });

    if (res.ok) {
      router.push("/admin/users");
    } else {
      const body = await res.json();
      alert(body.error ?? "Failed to delete user.");
      setDeletingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">User not found.</p>
        <Link
          href="/admin/users"
          className="mt-4 inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm"
        >
          <ArrowLeft size={14} /> Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={14} /> Back to Users
      </Link>

      {/* Header */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-700 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
              {(profile.full_name || profile.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white">
                  {profile.full_name || "Unnamed User"}
                </h1>
                {profile.is_admin && (
                  <span className="text-xs bg-rose-600/20 text-rose-400 border border-rose-600/30 rounded px-2 py-0.5">
                    admin
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm">{profile.email}</p>
              {profile.company && (
                <p className="text-slate-500 text-xs mt-0.5">
                  {profile.company}
                </p>
              )}
              <p className="text-slate-500 text-xs mt-1">
                Joined {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleDeleteUser}
            disabled={deletingUser}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {deletingUser ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            Delete User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800 rounded-xl p-1 w-fit border border-slate-700">
        {(["cards", "contacts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-rose-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab === "cards"
              ? `Cards (${cards.length})`
              : `Contacts (${contacts.length})`}
          </button>
        ))}
      </div>

      {/* Cards tab */}
      {activeTab === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-slate-400 bg-slate-800 rounded-2xl border border-slate-700">
              No cards yet.
            </div>
          ) : (
            cards.map((card) => (
              <div
                key={card.id}
                className="bg-slate-800 rounded-2xl border border-slate-700 p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{card.name}</p>
                    <p className="text-xs text-slate-400">
                      Template: {card.template_id || "—"} ·{" "}
                      {new Date(card.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  disabled={deletingCardId === card.id}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingCardId === card.id ? (
                    <div className="w-4 h-4 border border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Contacts tab */}
      {activeTab === "contacts" && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          {contacts.length === 0 ? (
            <p className="text-center py-12 text-slate-400">No contacts yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden md:table-cell">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-slate-400 font-medium text-right">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {(contact.full_name || "C").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">
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
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        disabled={deletingContactId === contact.id}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-600/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingContactId === contact.id ? (
                          <div className="w-3.5 h-3.5 border border-slate-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
