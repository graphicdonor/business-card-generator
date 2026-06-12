"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardData } from "@/types/card";
import { templates } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { preloadCommonFonts } from "@/lib/googleFonts";
import FontPicker from "./FontPicker";
import {
  User,
  Phone,
  Share2,
  Palette,
  QrCode,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  Sparkles,
  Loader2,
  LayoutTemplate,
} from "lucide-react";

interface Props {
  data: CardData;
  onChange: (updates: Partial<CardData>) => void;
  templateId?: string;
}

type TabId = "info" | "contact" | "social" | "branding" | "qr";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "info", label: "Personal", icon: <User size={15} /> },
  { id: "contact", label: "Contact", icon: <Phone size={15} /> },
  { id: "social", label: "Social", icon: <Share2 size={15} /> },
  { id: "branding", label: "Brand", icon: <Palette size={15} /> },
  { id: "qr", label: "QR Code", icon: <QrCode size={15} /> },
];

// Per-template field configuration
type SocialField = "linkedin" | "instagram" | "facebook" | "twitter" | "youtube";
type TemplateFieldConfig = {
  showAddress: boolean;
  showMobile: boolean;
  socialFields: SocialField[];
  showQR: boolean;
  showBackLogo: boolean;
};

const templateFieldConfig: Record<string, TemplateFieldConfig> = {
  "corporate-blue":  { showAddress: true,  showMobile: true,  socialFields: ["linkedin"],                                          showQR: true,  showBackLogo: true  },
  "minimal-white":   { showAddress: false, showMobile: false, socialFields: [],                                                    showQR: false, showBackLogo: true  },
  "dark-luxury":     { showAddress: false, showMobile: false, socialFields: [],                                                    showQR: false, showBackLogo: true  },
  "tech-modern":     { showAddress: false, showMobile: false, socialFields: ["linkedin"],                                          showQR: true,  showBackLogo: true  },
  "finance-gold":    { showAddress: true,  showMobile: false, socialFields: ["linkedin"],                                          showQR: true,  showBackLogo: true  },
  "medical-clean":   { showAddress: true,  showMobile: true,  socialFields: [],                                                    showQR: true,  showBackLogo: true  },
  "real-estate":     { showAddress: true,  showMobile: false, socialFields: [],                                                    showQR: true,  showBackLogo: true  },
  "creative-color":  { showAddress: false, showMobile: false, socialFields: ["instagram"],                                         showQR: true,  showBackLogo: true  },
  "bold-chevron":    { showAddress: true,  showMobile: false, socialFields: [],                                                    showQR: true,  showBackLogo: true  },
  "split-panel":     { showAddress: true,  showMobile: false, socialFields: [],                                                    showQR: true,  showBackLogo: false },
  "rdash-pro":       { showAddress: true,  showMobile: true,  socialFields: [],                                                    showQR: true,  showBackLogo: true  },
  "custom-upload":   { showAddress: true,  showMobile: true,  socialFields: ["linkedin","instagram","facebook","twitter","youtube"], showQR: true,  showBackLogo: false },
};

const defaultConfig: TemplateFieldConfig = {
  showAddress: true, showMobile: true,
  socialFields: ["linkedin", "instagram", "facebook", "twitter", "youtube"],
  showQR: true, showBackLogo: true,
};

const socialFieldMeta: Record<SocialField, { label: string; placeholder: string }> = {
  linkedin:  { label: "LinkedIn",    placeholder: "linkedin.com/in/yourname" },
  instagram: { label: "Instagram",   placeholder: "@yourhandle"              },
  twitter:   { label: "Twitter / X", placeholder: "@yourhandle"              },
  facebook:  { label: "Facebook",    placeholder: "facebook.com/yourpage"    },
  youtube:   { label: "YouTube",     placeholder: "youtube.com/@yourchannel" },
};

const colorPresets = [
  { name: "Corporate Blue", primary: "#2563EB", secondary: "#1E3A8A", accent: "#60A5FA" },
  { name: "Luxury Gold",    primary: "#D4AF37", secondary: "#1A1A2E", accent: "#C9A227" },
  { name: "Startup Purple", primary: "#8B5CF6", secondary: "#0F172A", accent: "#06B6D4" },
  { name: "Fashion Pink",   primary: "#EC4899", secondary: "#7C3AED", accent: "#F59E0B" },
  { name: "Dark Mode",      primary: "#64748B", secondary: "#0F172A", accent: "#94A3B8" },
  { name: "Forest Green",   primary: "#059669", secondary: "#064E3B", accent: "#34D399" },
];

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
      />
    </div>
  );
}

function FontSizeInline({ value = 100, onChange }: { value?: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 pt-1">
      <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Size</span>
      <button
        type="button"
        onClick={() => onChange(Math.max(50, value - 5))}
        className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded text-[10px] leading-none transition-colors"
      >−</button>
      <span className="text-[10px] font-mono text-slate-500 w-7 text-center tabular-nums">{value}%</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(200, value + 5))}
        className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded text-[10px] leading-none transition-colors"
      >+</button>
      {value !== 100 && (
        <button
          type="button"
          onClick={() => onChange(100)}
          className="text-[9px] text-blue-400 hover:text-blue-600 transition-colors"
          title="Reset to 100%"
        >↺</button>
      )}
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          {title}
        </span>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

function LogoUpload({
  label,
  value,
  onChange,
  hint,
  size,
  onSizeChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  hint?: string;
  size: number;
  onSizeChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt={label} className="w-full h-20 object-contain bg-white" style={{ transform: `scale(${size / 100})`, transformOrigin: "center" }} />
          <button
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg border border-slate-200 transition-all shadow-sm"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-3 p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
          <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors flex-shrink-0">
            <Upload size={14} className="text-slate-400 group-hover:text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-600 group-hover:text-blue-600">Upload {label}</p>
            <p className="text-[10px] text-slate-400">{hint ?? "PNG, SVG, max 2MB"}</p>
          </div>
          <input
            type="file"
            accept=".png,.svg,.jpg,.jpeg,.webp,image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                alert("File too large. Please upload under 2MB.");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => onChange(reader.result as string);
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
          />
        </label>
      )}
      {/* Size slider — always visible so user knows they can adjust */}
      <div className="flex items-center gap-2 px-0.5">
        <span className="text-[10px] text-slate-400 w-16 flex-shrink-0">Size {size}%</span>
        <input
          type="range"
          min={30}
          max={200}
          step={5}
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="flex-1 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
        {size !== 100 && (
          <button
            onClick={() => onSizeChange(100)}
            className="text-[10px] text-blue-400 hover:text-blue-600 flex-shrink-0 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt={label} className="w-full h-32 object-contain bg-white" />
          <button
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg border border-slate-200 transition-all shadow-sm"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
          <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <Upload size={16} className="text-slate-400 group-hover:text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-slate-600 group-hover:text-blue-600">Upload image</p>
            <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP, SVG</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 10 * 1024 * 1024) {
                alert("File too large. Please upload under 10MB.");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => onChange(reader.result as string);
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}

const pickerTemplates = templates.filter((t) => t.id !== "custom-upload");

export default function FormPanel({ data, onChange, templateId }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("info");
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);

  const tpl = templateFieldConfig[templateId ?? ""] ?? defaultConfig;

  useEffect(() => {
    preloadCommonFonts();
  }, []);

  const handleExtract = async () => {
    if (!data.customFrontImage) return;
    setExtracting(true);
    setExtracted(false);
    try {
      const res = await fetch("/api/extract-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: data.customFrontImage }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Extraction failed");
      }
      const extracted = await res.json();
      const updates: Partial<CardData> = {};
      const fields = [
        "fullName", "designation", "company", "phone", "mobile",
        "email", "website", "address", "linkedin", "instagram",
        "twitter", "logoText",
      ] as const;
      for (const field of fields) {
        if ((extracted as Record<string, string>)[field]) updates[field] = (extracted as Record<string, string>)[field];
      }
      if ((extracted as { primaryColor?: string }).primaryColor?.startsWith("#")) updates.primaryColor = (extracted as { primaryColor: string }).primaryColor;
      if ((extracted as { secondaryColor?: string }).secondaryColor?.startsWith("#")) updates.secondaryColor = (extracted as { secondaryColor: string }).secondaryColor;
      if ((extracted as { accentColor?: string }).accentColor?.startsWith("#")) updates.accentColor = (extracted as { accentColor: string }).accentColor;
      onChange(updates);
      setExtracted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`Extraction failed: ${msg}`);
    } finally {
      setExtracting(false);
    }
  };

  const handleSwitchTemplate = (newTemplateId: string) => {
    const { customFrontImage, customBackImage, ...rest } = data;
    void customFrontImage; void customBackImage;
    localStorage.setItem("pendingCardData", JSON.stringify(rest));
    router.push(`/builder/${newTemplateId}`);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tab Bar */}
      <div className="flex border-b border-slate-100 px-2 pt-2 gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-t-lg transition-all flex-shrink-0 whitespace-nowrap",
              activeTab === tab.id
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ── PERSONAL INFO TAB ── */}
        {activeTab === "info" && (
          <>
            {/* Custom upload section */}
            {templateId === "custom-upload" && (
              <Section title="Card Design Images">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-1">
                  <p className="text-xs text-blue-700 font-medium">Upload your card design</p>
                  <p className="text-[10px] text-blue-500 mt-0.5">
                    Upload front and back images, then extract text and colors to make it editable.
                  </p>
                </div>
                <ImageUploadField
                  label="Front Side"
                  value={data.customFrontImage}
                  onChange={(v) => { onChange({ customFrontImage: v }); setExtracted(false); }}
                />
                <ImageUploadField
                  label="Back Side (optional)"
                  value={data.customBackImage}
                  onChange={(v) => onChange({ customBackImage: v })}
                />

                {data.customFrontImage && (
                  <button
                    onClick={handleExtract}
                    disabled={extracting}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                      extracting
                        ? "bg-violet-100 text-violet-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-sm shadow-violet-500/20"
                    )}
                  >
                    {extracting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    {extracting ? "Extracting text & colors…" : "Extract & Make Editable"}
                  </button>
                )}

                {extracted && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 px-1">
                      <LayoutTemplate size={12} className="text-violet-500" />
                      <span className="text-[10px] font-semibold text-violet-600 uppercase tracking-wider">
                        Apply extracted data to a template
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {pickerTemplates.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleSwitchTemplate(t.id)}
                          className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-600 hover:text-violet-700 transition-all text-left"
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${t.defaultColors.primary}, ${t.defaultColors.secondary})` }}
                          />
                          <span className="truncate">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            <Section title="Personal Info">
              <div>
                <InputField
                  label="Full Name"
                  value={data.fullName}
                  onChange={(v) => onChange({ fullName: v })}
                  placeholder="Alex Johnson"
                />
                <FontSizeInline value={data.fontSizeName ?? 100} onChange={(v) => onChange({ fontSizeName: v })} />
              </div>
              <div>
                <InputField
                  label="Designation / Title"
                  value={data.designation}
                  onChange={(v) => onChange({ designation: v })}
                  placeholder="Senior Product Designer"
                />
                <FontSizeInline value={data.fontSizeTitle ?? 100} onChange={(v) => onChange({ fontSizeTitle: v })} />
              </div>
              <div>
                <InputField
                  label="Company Name"
                  value={data.company}
                  onChange={(v) => onChange({ company: v })}
                  placeholder="Innovate Studio"
                />
                <FontSizeInline value={data.fontSizeCompany ?? 100} onChange={(v) => onChange({ fontSizeCompany: v })} />
              </div>
              <InputField
                label="Logo Text (Monogram)"
                value={data.logoText}
                onChange={(v) => onChange({ logoText: v.substring(0, 3) })}
                placeholder="IS"
              />
            </Section>

            {/* Logo uploads */}
            {templateId !== "custom-upload" && (
              <Section title="Logo">
                {tpl.showBackLogo ? (
                  <div className="grid grid-cols-2 gap-3">
                    <LogoUpload
                      label="Front Logo"
                      value={data.logoUrlFront}
                      onChange={(v) => onChange({ logoUrlFront: v })}
                      size={data.logoSizeFront ?? 100}
                      onSizeChange={(v) => onChange({ logoSizeFront: v })}
                    />
                    <LogoUpload
                      label="Back Logo"
                      value={data.logoUrlBack}
                      onChange={(v) => onChange({ logoUrlBack: v })}
                      hint="Reuses front if empty"
                      size={data.logoSizeBack ?? 100}
                      onSizeChange={(v) => onChange({ logoSizeBack: v })}
                    />
                  </div>
                ) : (
                  <LogoUpload
                    label="Front Logo"
                    value={data.logoUrlFront}
                    onChange={(v) => onChange({ logoUrlFront: v })}
                    size={data.logoSizeFront ?? 100}
                    onSizeChange={(v) => onChange({ logoSizeFront: v })}
                  />
                )}
              </Section>
            )}

          </>
        )}

        {/* ── CONTACT TAB ── */}
        {activeTab === "contact" && (
          <Section title="Contact Details">
            <div>
              <InputField
                label="Phone"
                value={data.phone}
                onChange={(v) => onChange({ phone: v })}
                placeholder="+1 (555) 123-4567"
                type="tel"
              />
              <FontSizeInline value={data.fontSizePhone ?? 100} onChange={(v) => onChange({ fontSizePhone: v })} />
            </div>
            {tpl.showMobile && (
              <div>
                <InputField
                  label="Mobile"
                  value={data.mobile}
                  onChange={(v) => onChange({ mobile: v })}
                  placeholder="+1 (555) 987-6543"
                  type="tel"
                />
                <FontSizeInline value={data.fontSizePhone ?? 100} onChange={(v) => onChange({ fontSizePhone: v })} />
              </div>
            )}
            {tpl.showAddress && (
              <div>
                <InputField
                  label="Office Address"
                  value={data.address}
                  onChange={(v) => onChange({ address: v })}
                  placeholder="123 Design Street, San Francisco, CA"
                />
                <FontSizeInline value={data.fontSizeAddress ?? 100} onChange={(v) => onChange({ fontSizeAddress: v })} />
              </div>
            )}
            <div>
              <InputField
                label="Email Address"
                value={data.email}
                onChange={(v) => onChange({ email: v })}
                placeholder="alex@company.com"
                type="email"
              />
              <FontSizeInline value={data.fontSizeEmail ?? 100} onChange={(v) => onChange({ fontSizeEmail: v })} />
            </div>
            <div>
              <InputField
                label="Website"
                value={data.website}
                onChange={(v) => onChange({ website: v })}
                placeholder="www.company.com"
              />
              <FontSizeInline value={data.fontSizeWebsite ?? 100} onChange={(v) => onChange({ fontSizeWebsite: v })} />
            </div>
          </Section>
        )}

        {/* ── SOCIAL TAB ── */}
        {activeTab === "social" && (
          tpl.socialFields.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Share2 size={20} className="text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">No social fields for this template</p>
                <p className="text-xs text-slate-400 mt-1">
                  This template doesn&apos;t display social media profiles on the card.
                  Switch to a template like Creative or Tech Modern to add social links.
                </p>
              </div>
            </div>
          ) : (
            <Section title="Social Profiles">
              {tpl.socialFields.map((field) => (
                <InputField
                  key={field}
                  label={socialFieldMeta[field].label}
                  value={data[field]}
                  onChange={(v) => onChange({ [field]: v })}
                  placeholder={socialFieldMeta[field].placeholder}
                />
              ))}
            </Section>
          )
        )}

        {/* ── BRANDING TAB ── */}
        {activeTab === "branding" && (
          <>
            <Section title="Color Presets">
              <div className="grid grid-cols-3 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => onChange({ primaryColor: preset.primary, secondaryColor: preset.secondary, accentColor: preset.accent })}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="flex gap-1">
                      {[preset.primary, preset.secondary, preset.accent].map((c) => (
                        <div key={c} className="w-4 h-4 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 text-center leading-tight group-hover:text-blue-600">{preset.name}</span>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Custom Colors">
              {([
                { label: "Primary Color",   key: "primaryColor"   as keyof CardData },
                { label: "Secondary Color", key: "secondaryColor" as keyof CardData },
                { label: "Accent Color",    key: "accentColor"    as keyof CardData },
              ] as const).map(({ label, key }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">{(data[key] as string) || "#000000"}</span>
                    <label className="relative cursor-pointer">
                      <div className="w-10 h-8 rounded-lg border-2 border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: (data[key] as string) || "#000000" }} />
                      <input
                        type="color"
                        value={(data[key] as string) || "#000000"}
                        onChange={(e) => onChange({ [key]: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </Section>

            <Section title="Typography">
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Font Family</label>
                <FontPicker value={data.fontFamily} onChange={(font) => onChange({ fontFamily: font })} />
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                  <div style={{ fontFamily: `"${data.fontFamily}", sans-serif` }} className="text-center">
                    <p className="text-2xl font-bold text-slate-800 leading-tight">{data.fullName || "Alex Johnson"}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">{data.designation || "Product Designer"}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex justify-center gap-4 text-[10px] text-slate-400">
                      <span>AaBbCc</span><span>123</span><span>!@#</span>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Font Sizes">
              <div className="space-y-5">
                {(
                  [
                    { label: "Name",              key: "fontSizeName"    as const, hint: data.fontSizeName    },
                    { label: "Title / Designation", key: "fontSizeTitle"  as const, hint: data.fontSizeTitle  },
                    { label: "Contact Details",   key: "fontSizeDetails" as const, hint: data.fontSizeDetails },
                  ] as const
                ).map(({ label, key, hint }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">{label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400 w-8 text-right">{hint}%</span>
                        <button onClick={() => onChange({ [key]: 100 })} className="text-[10px] text-slate-400 hover:text-blue-500 transition-colors">Reset</button>
                      </div>
                    </div>
                    <input type="range" min={50} max={200} step={5} value={hint} onChange={(e) => onChange({ [key]: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-300"><span>50%</span><span>Default</span><span>200%</span></div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ── QR CODE TAB ── */}
        {activeTab === "qr" && (
          tpl.showQR ? (
            <Section title="QR Code Settings">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Show QR Code</span>
                <button
                  onClick={() => onChange({ showQR: !data.showQR })}
                  className={cn("relative w-11 h-6 rounded-full transition-colors", data.showQR ? "bg-blue-500" : "bg-slate-200")}
                >
                  <div className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform", data.showQR ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>

              {data.showQR && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">QR Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["website", "linkedin", "vcard", "custom"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => onChange({ qrCodeType: type })}
                          className={cn(
                            "px-3 py-2 text-xs rounded-lg border transition-all capitalize",
                            data.qrCodeType === type
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                          )}
                        >
                          {type === "vcard" ? "vCard" : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.qrCodeType !== "vcard" && (
                    <InputField
                      label={data.qrCodeType === "website" ? "Website URL" : data.qrCodeType === "linkedin" ? "LinkedIn URL" : "Custom URL"}
                      value={data.qrCodeValue}
                      onChange={(v) => onChange({ qrCodeValue: v })}
                      placeholder={data.qrCodeType === "website" ? "https://yourwebsite.com" : "https://..."}
                    />
                  )}

                  {data.qrCodeType === "vcard" && (
                    <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
                      The QR code will encode your complete contact information as a vCard that can be saved directly to a phone.
                    </p>
                  )}
                </>
              )}
            </Section>
          ) : (
            <div className="flex flex-col items-center gap-3 py-10 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <QrCode size={20} className="text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">QR Code not available</p>
                <p className="text-xs text-slate-400 mt-1">
                  This template doesn&apos;t include a QR code. Choose a different template to add one.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
