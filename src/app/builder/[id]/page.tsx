"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { getTemplate, defaultCardData } from "@/lib/templates";
import { CardData } from "@/types/card";
import FormPanel from "@/components/builder/FormPanel";
import CardPreview from "@/components/builder/CardPreview";
import ExportModal from "@/components/builder/ExportModal";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Download,
  Save,
  Layers,
  Sparkles,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function BuilderPage({ params }: Props) {
  const { id } = use(params);
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
  const [saved, setSaved] = useState(false);
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");

  // Restore extracted card data when navigating from the custom-upload template
  useEffect(() => {
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
  }, []);

  const handleChange = (updates: Partial<CardData>) => {
    setCardData((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    if (template) {
      setCardData(defaultCardData(template));
    }
  };

  const handleSave = () => {
    // Save to localStorage
    const key = `card-${id}-${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(cardData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4 z-30">
        {/* Left: Nav */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm transition-colors flex-shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Templates</span>
          </Link>
          <span className="text-slate-200">/</span>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 min-w-0">
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

        {/* Center: Card size selector */}
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
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Double-sided toggle */}
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
            <RefreshCw size={16} />
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all",
              saved
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            <Save size={14} />
            {saved ? "Saved!" : "Save"}
          </button>

          {/* Export */}
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm shadow-blue-500/20 transition-all"
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left Panel: Form */}
        <aside className="w-[360px] flex-shrink-0 border-r border-slate-200 overflow-hidden flex flex-col bg-white">
          <FormPanel data={cardData} onChange={handleChange} templateId={id} side={activeSide} />
        </aside>

        {/* Right Panel: Preview */}
        <main className="flex-1 min-w-0 overflow-hidden">
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
