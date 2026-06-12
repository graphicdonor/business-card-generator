"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, User, Lock, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({ full_name: "", email: "", company: "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [passMsg, setPassMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("full_name, email, company").eq("id", user.id).single();
      if (data) {
        setProfile({
          full_name: data.full_name ?? "",
          email: data.email ?? user.email ?? "",
          company: data.company ?? "",
        });
      }
      setLoadingProfile(false);
    };
    load();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      company: profile.company,
    }).eq("id", user.id);
    setProfileMsg(error ? { type: "err", text: error.message } : { type: "ok", text: "Profile updated." });
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      setPassMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    if (passwords.next.length < 6) {
      setPassMsg({ type: "err", text: "Password must be at least 6 characters." });
      return;
    }
    setSavingPass(true);
    setPassMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: passwords.next });
    setPassMsg(error ? { type: "err", text: error.message } : { type: "ok", text: "Password updated successfully." });
    if (!error) setPasswords({ current: "", next: "", confirm: "" });
    setSavingPass(false);
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-black text-slate-900 mb-7">Settings</h1>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <User size={15} className="text-blue-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Profile</h2>
        </div>

        {profileMsg && (
          <div className={`mb-4 flex items-center gap-2 p-3 rounded-xl text-sm ${profileMsg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {profileMsg.type === "ok" && <CheckCircle size={14} />}
            {profileMsg.text}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed here.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
              placeholder="Acme Inc."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-blue-500/20"
          >
            {savingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {savingProfile ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
            <Lock size={15} className="text-slate-500" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
        </div>

        {passMsg && (
          <div className={`mb-4 flex items-center gap-2 p-3 rounded-xl text-sm ${passMsg.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {passMsg.type === "ok" && <CheckCircle size={14} />}
            {passMsg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
            <input
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
              placeholder="Min. 6 characters"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="Repeat new password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={savingPass || !passwords.next || !passwords.confirm}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
          >
            {savingPass ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
            {savingPass ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
