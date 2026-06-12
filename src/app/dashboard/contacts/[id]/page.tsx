"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Trash2,
  Loader2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  MessageSquare,
  PhoneCall,
  Video,
  Plus,
  Edit2,
  Save,
  X,
} from "lucide-react";

interface Contact {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  address: string | null;
  website: string | null;
  notes: string | null;
  created_at: string;
}

interface Interaction {
  id: string;
  type: "note" | "call" | "email" | "meeting";
  content: string;
  created_at: string;
}

const TYPE_ICON: Record<string, React.ElementType> = {
  note: MessageSquare,
  call: PhoneCall,
  email: Mail,
  meeting: Video,
};

const TYPE_COLOR: Record<string, string> = {
  note: "bg-slate-100 text-slate-600",
  call: "bg-green-50 text-green-600",
  email: "bg-blue-50 text-blue-600",
  meeting: "bg-violet-50 text-violet-600",
};

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Contact>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newInteraction, setNewInteraction] = useState({ type: "note" as Interaction["type"], content: "" });
  const [addingNote, setAddingNote] = useState(false);
  const [submittingNote, setSubmittingNote] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const [{ data: c }, { data: i }] = await Promise.all([
      supabase.from("contacts").select("*").eq("id", id).single(),
      supabase.from("interactions").select("*").eq("contact_id", id).order("created_at", { ascending: false }),
    ]);
    if (c) { setContact(c); setEditForm(c); }
    setInteractions(i ?? []);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!confirm("Delete this contact and all interaction history?")) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) {
      setDeleting(false);
      return;
    }
    router.push("/dashboard/contacts");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const supabase = createClient();
    const { error } = await supabase.from("contacts").update(editForm).eq("id", id);
    if (error) {
      setSaveError(error.message);
    } else {
      await load();
      setEditing(false);
    }
    setSaving(false);
  };

  const handleAddInteraction = async () => {
    if (!newInteraction.content.trim()) return;
    setSubmittingNote(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSubmittingNote(false); return; }
    await supabase.from("interactions").insert({
      contact_id: id,
      user_id: user.id,
      type: newInteraction.type,
      content: newInteraction.content.trim(),
    });
    setNewInteraction({ type: "note", content: "" });
    setAddingNote(false);
    setSubmittingNote(false);
    await load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Contact not found</p>
        <Link href="/dashboard/contacts" className="text-blue-600 text-sm mt-2 inline-block">Back to contacts</Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard/contacts"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Contacts
      </Link>

      {/* Contact card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0">
              {contact.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              {editing ? (
                <input
                  value={editForm.full_name ?? ""}
                  onChange={(e) => setEditForm((p) => ({ ...p, full_name: e.target.value }))}
                  className="text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              ) : (
                <h1 className="text-xl font-black text-slate-900">{contact.full_name}</h1>
              )}
              <p className="text-slate-400 text-sm mt-0.5">
                {contact.title && contact.company ? `${contact.title} at ${contact.company}` :
                 contact.title || contact.company || "No title"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {editing ? (
              <>
                {saveError && <span className="text-xs text-red-500 max-w-[100px] truncate" title={saveError}>{saveError}</span>}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Save
                </button>
                <button
                  onClick={() => { setEditing(false); setEditForm(contact); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(editing ? [
            { icon: Mail, label: "Email", key: "email" as const, type: "email" },
            { icon: Phone, label: "Phone", key: "phone" as const, type: "tel" },
            { icon: Building2, label: "Company", key: "company" as const },
            { icon: Briefcase, label: "Title", key: "title" as const },
            { icon: Globe, label: "Website", key: "website" as const, type: "url" },
            { icon: MapPin, label: "Address", key: "address" as const },
          ] : [
            { icon: Mail, value: contact.email, href: contact.email ? `mailto:${contact.email}` : undefined },
            { icon: Phone, value: contact.phone, href: contact.phone ? `tel:${contact.phone}` : undefined },
            { icon: Building2, value: contact.company },
            { icon: Briefcase, value: contact.title },
            { icon: Globe, value: contact.website, href: contact.website ?? undefined },
            { icon: MapPin, value: contact.address },
          ].filter((f) => f.value)).map((f, i) => {
            if (editing && "key" in f) {
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <f.icon size={14} className="text-slate-400 flex-shrink-0" />
                  <input
                    type={(f as { type?: string }).type ?? "text"}
                    value={(editForm[f.key] ?? "") as string}
                    onChange={(e) => setEditForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.label}
                    className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              );
            }
            if (!editing && "value" in f && f.value) {
              const content = (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <f.icon size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{f.value}</span>
                </div>
              );
              return (f as { href?: string }).href ? (
                <a key={i} href={(f as { href?: string }).href} className="flex items-center gap-2.5 text-sm text-blue-600 hover:underline">
                  <f.icon size={14} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{f.value}</span>
                </a>
              ) : content;
            }
            return null;
          })}
        </div>

        {/* Notes */}
        {(editing || contact.notes) && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes</p>
            {editing ? (
              <textarea
                value={editForm.notes ?? ""}
                onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                rows={3}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">{contact.notes}</p>
            )}
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <h2 className="text-sm font-bold text-slate-900">Activity ({interactions.length})</h2>
          <button
            onClick={() => setAddingNote(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Plus size={13} />
            Log activity
          </button>
        </div>

        {/* Add interaction form */}
        {addingNote && (
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex gap-2 mb-2.5">
              {(["note", "call", "email", "meeting"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setNewInteraction((p) => ({ ...p, type: t }))}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors capitalize ${
                    newInteraction.type === t
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              value={newInteraction.content}
              onChange={(e) => setNewInteraction((p) => ({ ...p, content: e.target.value }))}
              placeholder={`Add a ${newInteraction.type}...`}
              rows={2}
              className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none mb-2.5"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddInteraction}
                disabled={submittingNote || !newInteraction.content.trim()}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                {submittingNote ? <Loader2 size={12} className="animate-spin" /> : null}
                Save
              </button>
              <button
                onClick={() => setAddingNote(false)}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {interactions.length === 0 && !addingNote ? (
          <div className="px-5 py-8 text-center text-sm text-slate-400">No activity yet</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {interactions.map((item) => {
              const Icon = TYPE_ICON[item.type] ?? MessageSquare;
              return (
                <div key={item.id} className="flex gap-3.5 px-5 py-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${TYPE_COLOR[item.type]}`}>
                    <Icon size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-500 capitalize">{item.type}</span>
                      <span className="text-xs text-slate-300">
                        {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
