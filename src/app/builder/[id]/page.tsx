"use client";

import { useState, use, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getTemplate, defaultCardData } from "@/lib/templates";
import { CardData } from "@/types/card";
import FormPanel from "@/components/builder/FormPanel";
import CardPreview from "@/components/builder/CardPreview";
import ExportModal from "@/components/builder/ExportModal";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Download,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Cloud,
  CheckCircle,
  LayoutDashboard,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

function BuilderInner({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const cardId = searchParams.get("cardId");
  const template = getTemplate(id);

  const [cardData, setCardData] = useState<CardData>(
    defaultCardData(template ?? {
      id: "corporate-blue",
      name: "Corporate Blue",
      category: "Corporate",
      description: "",
      isPremium: false,
      isDoubleSided: true,
      tags: [],
      previewBg: "",
      defaultColors: { primary: "#2563EB", secondary: "#1E3A8A", accent: "#60A5FA" },
      defaultFont: "Inter",
    })
  );

  const [exportOpen, setExportOpen] = useState(false);
  const [cloudSaved, setCloudSaved] = useState(false);
  const [cloudSaving, setCloudSaving] = useState(false);
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [loadingCard, setLoadingCard] = useState(!!cardId);
  const loadedRef = useRef(false);

  // Load saved card from Supabase if cardId is in URL
  useEffect(() => {
    if (!cardId || loadedRef.current) return;
    loadedRef.current = true;
    const supabase = createClient();
    supabase
      .from("business_cards")
      .select("card_data")
      .eq("id", cardId)
      .single()
      .then(({ data }) => {
        if (data?.card_data) {
          setCardData(data.card_data as CardData);
        }
        setLoadingCard(false);
      });
  }, [cardId]);

  // Load from localStorage (pending data from old flow)
  useEffect(() => {
    if (cardId) return; // skip if editing a saved card
    const pending = localStorage.getItem("pendingCardData");
    if (pending) {
      localStorage.removeItem("pendingCardData");
      try {
        const parsed = JSON.parse(pending);
        setCardData((prev) => ({ ...prev, ...parsed }));
      } catch {
        // ignore malformed data
      }
    }
  }, [cardId]);

  const handleChange = (updates: Partial<CardData>) => {
    setCardData((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    if (template) {
      setCardData(defaultCardData(template));
    }
  };

  const handleCloudSave = async () => {
    setCloudSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = `/auth/login?redirect=/builder/${id}${cardId ? `?cardId=${cardId}` : ""}`;
      return;
    }
    const cardName = cardData.fullName
      ? `${cardData.fullName}${template?.name ? ` — ${template.name}` : ""}`
      : `Card ${new Date().toLocaleDateString()}`;

    if (cardId) {
      // Update existing saved card
      await supabase.from("business_cards").update({ card_data: cardData, name: cardName }).eq("id", cardId);
    } else {
      // Create new saved card
      await supabase.from("business_cards").insert({
        user_id: user.id,
        name: cardName,
        template_id: id,
        card_data: cardData,
      });
    }
    setCloudSaving(false);
    setCloudSaved(true);
    setTimeout(() => setCloudSaved(false), 3000);
  };

  if (loadingCard) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading card...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-700">Template not found</h2>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline">
            <ArrowLeft size={16} />
            Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Navbar */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 z-30">
        {/* Left: Nav */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Templates</span>
          </Link>
          <span className="hidden sm:block text-slate-200">/</span>

          <div className="hidden sm:flex items-center gap-1 min-w-0">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-800 truncate">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-violet-600 rounded flex items-center justify-center flex-shrink-0">
                <Sparkles size={10} className="text-white" />
              </div>
              {template.name}
            </span>
            {template.isPremium && (
              <span className="flex-shrink-0 text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                PRO
              </span>
            )}
          </div>
        </div>

        {/* Center: Card size selector — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-lg p-1 text-xs font-medium">
          {([
            { id: "us", label: "US  3.5×2″" },
            { id: "eu", label: "EU  85×55" },
            { id: "india", label: "IN  90×55" },
          ] as const).map((size) => (
            <button
              key={size.id}
              onClick={() => handleChange({ cardSize: size.id })}
              className={cn(
                "px-3 py-1.5 rounded-md transition-all",
                cardData.cardSize === size.id
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {size.label}
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Double-sided toggle — hidden on small mobile */}
          <button
            onClick={() => handleChange({ isDoubleSided: !cardData.isDoubleSided })}
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all",
              cardData.isDoubleSided
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            )}
          >
            <Layers size={13} />
            {cardData.isDoubleSided ? "Double" : "Single"}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            title="Reset to defaults"
          >
            <RefreshCw size={15} />
          </button>

          {/* Save to account */}
          <button
            onClick={handleCloudSave}
            disabled={cloudSaving}
            className={cn(
              "flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-lg border transition-all",
              cloudSaved
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
            title="Save to your account"
          >
            {cloudSaved ? <CheckCircle size={13} /> : <Cloud size={13} />}
            <span className="hidden sm:inline">{cloudSaved ? "Saved!" : "Save to Account"}</span>
          </button>

          {/* Export */}
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm shadow-blue-500/20 transition-all"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
            title="Go to Dashboard"
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Mobile Edit/Preview toggle */}
      <div className="flex sm:hidden flex-shrink-0 bg-white border-b border-slate-200">
        <button
          onClick={() => setMobileView("edit")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors border-b-2",
            mobileView === "edit"
              ? "text-blue-600 border-blue-600"
              : "text-slate-500 border-transparent"
          )}
        >
          <SlidersHorizontal size={15} />
          Edit
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors border-b-2",
            mobileView === "preview"
              ? "text-blue-600 border-blue-600"
              : "text-slate-500 border-transparent"
          )}
        >
          <Eye size={15} />
          Preview
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 flex-col sm:flex-row">
        {/* Left Panel: Form */}
        <aside
          className={cn(
            "sm:w-[360px] sm:flex-shrink-0 border-r border-slate-200 overflow-hidden flex flex-col bg-white",
            mobileView === "edit" ? "flex flex-1 sm:flex-none" : "hidden sm:flex"
          )}
        >
          <FormPanel data={cardData} onChange={handleChange} templateId={id} side={activeSide} />
        </aside>

        {/* Right Panel: Preview */}
        <main
          className={cn(
            "sm:flex-1 sm:min-w-0 overflow-hidden",
            mobileView === "preview" ? "flex flex-col flex-1" : "hidden sm:block"
          )}
        >
          <CardPreview templateId={id} data={cardData} activeSide={activeSide} onSideChange={setActiveSide} />
        </main>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        data={cardData}
        templateId={id}
        templateName={template.name}
      />
    </div>
  );
}

export default function BuilderPage({ params }: Props) {
  const { id } = use(params);
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BuilderInner id={id} />
    </Suspense>
  );
}
