"use client";

import { useState } from "react";
import { CardData } from "@/types/card";
import { cn } from "@/lib/utils";
import { X, Download, FileImage, FileText, Code, Loader2, CheckCircle } from "lucide-react";
import { exportAsPNG, exportAsPDF, exportAsSVG } from "@/lib/exportUtils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: CardData;
  templateId: string;
  templateName: string;
}

type Format = "png" | "pdf" | "svg";

const formats: {
  id: Format;
  label: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
}[] = [
  {
    id: "png",
    label: "PNG Image",
    desc: "High-resolution raster image at 300 DPI",
    icon: <FileImage size={20} />,
    badge: "300 DPI",
  },
  {
    id: "pdf",
    label: "PDF Document",
    desc: "Print-ready PDF with embedded fonts",
    icon: <FileText size={20} />,
    badge: "Print Ready",
  },
  {
    id: "svg",
    label: "SVG Vector",
    desc: "Scalable vector for editing in Illustrator",
    icon: <Code size={20} />,
    badge: "Editable",
  },
];

export default function ExportModal({ isOpen, onClose, data, templateId, templateName }: Props) {
  const [selectedFormat, setSelectedFormat] = useState<Format>("png");
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const filename = `${data.fullName || "business-card"}-${templateName}`
    .toLowerCase()
    .replace(/\s+/g, "-");

  const handleExport = async () => {
    setExporting(true);
    setSuccess(false);
    try {
      if (selectedFormat === "png") {
        await exportAsPNG("card-preview-element", filename);
      } else if (selectedFormat === "pdf") {
        await exportAsPDF("card-preview-element", filename);
      } else if (selectedFormat === "svg") {
        exportAsSVG("card-preview-element", filename);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Export Card</h2>
            <p className="text-sm text-slate-500 mt-0.5">Choose format and download</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Format Selection */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Select Format
          </p>

          {formats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                selectedFormat === fmt.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div
                className={cn(
                  "p-2.5 rounded-lg",
                  selectedFormat === fmt.id
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {fmt.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      selectedFormat === fmt.id ? "text-blue-700" : "text-slate-700"
                    )}
                  >
                    {fmt.label}
                  </span>
                  {fmt.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium",
                        selectedFormat === fmt.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {fmt.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{fmt.desc}</p>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  selectedFormat === fmt.id
                    ? "border-blue-500"
                    : "border-slate-300"
                )}
              >
                {selectedFormat === fmt.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Card info */}
        <div className="mx-6 mb-6 p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Name: <span className="font-medium text-slate-700">{data.fullName || "—"}</span></span>
            <span>Template: <span className="font-medium text-slate-700">{templateName}</span></span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5">
            <span>Size: <span className="font-medium text-slate-700">
              {data.cardSize === "us" ? "3.5 × 2 in" : data.cardSize === "eu" ? "85 × 55 mm" : "90 × 55 mm"}
            </span></span>
            <span>Sides: <span className="font-medium text-slate-700">{data.isDoubleSided ? "Double" : "Single"}</span></span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all",
              success
                ? "bg-green-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25",
              exporting && "opacity-80 cursor-not-allowed"
            )}
          >
            {exporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Exporting...
              </>
            ) : success ? (
              <>
                <CheckCircle size={16} />
                Downloaded!
              </>
            ) : (
              <>
                <Download size={16} />
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
