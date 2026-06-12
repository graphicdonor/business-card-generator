"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { googleFonts, loadGoogleFont, GoogleFont } from "@/lib/googleFonts";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X, Check, Type } from "lucide-react";

interface Props {
  value: string;
  onChange: (font: string) => void;
}

type CategoryFilter = "all" | "sans-serif" | "serif" | "display" | "monospace";

const categoryLabels: Record<CategoryFilter, string> = {
  all: "All",
  "sans-serif": "Sans",
  serif: "Serif",
  display: "Display",
  monospace: "Mono",
};

const categoryColors: Record<GoogleFont["category"], string> = {
  "sans-serif": "bg-blue-100 text-blue-700",
  serif: "bg-amber-100 text-amber-700",
  display: "bg-violet-100 text-violet-700",
  monospace: "bg-green-100 text-green-700",
};

function FontPreviewItem({
  font,
  isSelected,
  onSelect,
}: {
  font: GoogleFont;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadGoogleFont(font.name);
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, [font.name]);

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left",
        isSelected
          ? "bg-blue-50 border border-blue-200"
          : "hover:bg-slate-50 border border-transparent"
      )}
    >
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-base leading-tight truncate transition-opacity",
            loaded ? "opacity-100" : "opacity-50"
          )}
          style={{
            fontFamily: `"${font.name}", ${font.category}`,
            fontSize: font.category === "display" ? "16px" : "15px",
            fontWeight: font.category === "serif" ? 500 : 600,
            color: isSelected ? "#1d4ed8" : "#1e293b",
          }}
        >
          {font.name}
        </p>
        <p
          className={cn(
            "text-xs text-slate-400 truncate mt-0.5 transition-opacity",
            loaded ? "opacity-100" : "opacity-0"
          )}
          style={{ fontFamily: `"${font.name}", ${font.category}`, fontWeight: 400 }}
        >
          Aa Bb Cc 1 2 3
        </p>
      </div>
      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
        <span
          className={cn(
            "text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide",
            categoryColors[font.category]
          )}
        >
          {font.category === "sans-serif" ? "sans" : font.category}
        </span>
        {isSelected && (
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check size={11} className="text-white" />
          </div>
        )}
      </div>
    </button>
  );
}

export default function FontPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) loadGoogleFont(value);
  }, [value]);

  // Focus search when panel opens; scroll it into view
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchRef.current?.focus();
        containerRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 60);
    }
  }, [open]);

  const filtered = googleFonts.filter((f) => {
    const matchCat = category === "all" || f.category === category;
    const matchSearch =
      search === "" || f.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSelect = useCallback(
    (fontName: string) => {
      loadGoogleFont(fontName);
      onChange(fontName);
      setOpen(false);
      setSearch("");
    },
    [onChange]
  );

  const selectedFont = googleFonts.find((f) => f.name === value);

  return (
    <div ref={containerRef} className="space-y-1">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 border rounded-lg transition-all",
          open
            ? "border-blue-400 ring-2 ring-blue-500/20 bg-white rounded-b-none border-b-0"
            : "border-slate-200 hover:border-slate-300"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
            <Type size={13} className="text-slate-500" />
          </div>
          <div className="min-w-0 text-left">
            <p
              className="text-sm font-semibold text-slate-800 leading-none truncate"
              style={{ fontFamily: `"${value}", ${selectedFont?.category ?? "sans-serif"}` }}
            >
              {value || "Select Font"}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
              {selectedFont?.category ?? "font"}
            </p>
          </div>
        </div>
        <ChevronDown
          size={15}
          className={cn(
            "text-slate-400 flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Inline accordion panel */}
      {open && (
        <div className="border border-blue-400 border-t-0 rounded-b-lg overflow-hidden bg-white ring-2 ring-blue-500/20 ring-t-0">
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search fonts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div
            className="flex gap-1 px-2 py-1.5 border-b border-slate-100 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {(Object.entries(categoryLabels) as [CategoryFilter, string][]).map(
              ([cat, label]) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all flex-shrink-0",
                    category === cat
                      ? "bg-slate-800 text-white"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {label}
                  <span className="ml-1 text-[10px] opacity-60">
                    {cat === "all"
                      ? googleFonts.length
                      : googleFonts.filter((f) => f.category === cat).length}
                  </span>
                </button>
              )
            )}
          </div>

          {/* Font list — fixed height scroll */}
          <div className="overflow-y-auto p-1.5" style={{ maxHeight: 260 }}>
            {filtered.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">No fonts found</div>
            ) : (
              <div className="space-y-0.5">
                {filtered.map((font) => (
                  <FontPreviewItem
                    key={font.name}
                    font={font}
                    isSelected={value === font.name}
                    onSelect={() => handleSelect(font.name)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              {filtered.length} font{filtered.length !== 1 ? "s" : ""}
            </span>
            <a
              href="https://fonts.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-blue-500 hover:text-blue-700"
            >
              Google Fonts ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
