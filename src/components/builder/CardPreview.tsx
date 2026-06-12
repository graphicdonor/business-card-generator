"use client";

import { useState, useRef } from "react";
import { CardData } from "@/types/card";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from "lucide-react";

interface Props {
  templateId: string;
  data: CardData;
  showBothSides?: boolean;
}

export default function CardPreview({ templateId, data, showBothSides = false }: Props) {
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [zoom, setZoom] = useState(1);
  const [showSafeArea, setShowSafeArea] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cardW = 700;
  const cardH = 400;

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {(["front", "back"] as const).map((side) => (
            <button
              key={side}
              onClick={() => setActiveSide(side)}
              disabled={side === "back" && !data.isDoubleSided}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                activeSide === side
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
                side === "back" && !data.isDoubleSided && "opacity-40 cursor-not-allowed"
              )}
            >
              {side}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSafeArea(!showSafeArea)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all border",
              showSafeArea
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            )}
          >
            {showSafeArea ? <Eye size={13} /> : <EyeOff size={13} />}
            Safe Area
          </button>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
              className="p-1.5 hover:bg-slate-50 rounded-md text-slate-500 transition-colors"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-xs font-medium text-slate-600 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              className="p-1.5 hover:bg-slate-50 rounded-md text-slate-500 transition-colors"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:bg-slate-50 rounded-md text-slate-500 transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Preview area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-8 overflow-auto"
        style={{
          background: "radial-gradient(circle at center, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundColor: "#f8fafc",
        }}
      >
        <div
          style={{ transform: `scale(${zoom})`, transition: "transform 0.2s ease" }}
          className="relative"
        >
          {/* Card shadow */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 25px 60px rgba(0,0,0,0.18), 0 10px 25px rgba(0,0,0,0.12)",
              width: cardW,
              height: cardH,
            }}
          >
            <div id="card-preview-element">
              <TemplateRenderer
                templateId={templateId}
                data={data}
                side={activeSide}
                scale={cardW / 1050}
              />
            </div>
          </div>

          {/* Safe area overlay */}
          {showSafeArea && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                border: "2px dashed rgba(245, 158, 11, 0.6)",
                borderRadius: "8px",
                margin: `${(cardH * 0.05)}px ${(cardW * 0.05)}px`,
                backgroundColor: "rgba(245, 158, 11, 0.03)",
              }}
            />
          )}

          {/* Bleed area indicator */}
          {showSafeArea && (
            <div
              className="absolute pointer-events-none"
              style={{
                inset: "-8px",
                border: "2px dashed rgba(239, 68, 68, 0.4)",
                borderRadius: "4px",
              }}
            />
          )}
        </div>
      </div>

      {/* Card size indicator */}
      <div className="px-6 py-3 bg-white border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            {data.cardSize === "us"
              ? "US Standard: 3.5 × 2 in"
              : data.cardSize === "eu"
              ? "EU Standard: 85 × 55 mm"
              : "India Standard: 90 × 55 mm"}
          </span>
          <div className="flex items-center gap-3">
            {showSafeArea && (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-amber-400 inline-block border-b border-dashed border-amber-400" />
                  Safe Area
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-red-400 inline-block border-b border-dashed border-red-400" />
                  Bleed (3mm)
                </span>
              </>
            )}
            <span>300 DPI Export</span>
          </div>
        </div>
      </div>
    </div>
  );
}
