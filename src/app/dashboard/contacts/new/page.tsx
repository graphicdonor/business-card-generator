"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";

function Field({ label, value, onChange, type = "text", placeholder, required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
      />
    </div>
  );
}

export default function NewContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    address: "",
    website: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); setLoading(false); return; }

    const payload = Object.fromEntries(
      Object.entries({ ...form, user_id: user.id }).filter(([, v]) => v !== "")
    );

    const { error: err } = await supabase.from("contacts").insert(payload);
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      router.push("/dashboard/contacts");
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard/contacts"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to contacts
      </Link>

      <div className="flex items-center gap-3 mb-7">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <UserPlus size={18} className="text-blue-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">New Contact</h1>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <Field label="Full name" value={form.full_name} onChange={set("full_name")} placeholder="Alex Johnson" required />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" type="email" value={form.email} onChange={set("email")} placeholder="alex@company.com" />
          <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company" value={form.company} onChange={set("company")} placeholder="Acme Inc." />
          <Field label="Title" value={form.title} onChange={set("title")} placeholder="Product Manager" />
        </div>

        <Field label="Address" value={form.address} onChange={set("address")} placeholder="123 Main St, City" />
        <Field label="Website" type="url" value={form.website} onChange={set("website")} placeholder="https://example.com" />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes")(e.target.value)}
            rows={3}
            placeholder="Any notes about this contact..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
          />
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="submit"
            disabled={loading || !form.full_name.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? "Saving..." : "Save Contact"}
          </button>
          <Link
            href="/dashboard/contacts"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
