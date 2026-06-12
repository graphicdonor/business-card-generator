export type SocialField = "linkedin" | "instagram" | "facebook" | "twitter" | "youtube";

export interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface TemplateFormConfig {
  sectionLabel: string; // title for the Personal Info section
  personal: {
    showSlogan: boolean;
    showLogoFront: boolean;
    showLogoBack: boolean;
  };
  contact: {
    showCompany: boolean;
    showPhone: boolean;
    showMobile: boolean;
    showAddress: boolean;
    showEmail: boolean;
    showWebsite: boolean;
  };
  social: SocialField[];
  showQR: boolean;
  colorPresets: ColorPreset[];
}

const corporate: ColorPreset[] = [
  { name: "Corporate Blue",  primary: "#2563EB", secondary: "#1E3A8A", accent: "#60A5FA" },
  { name: "Navy & Silver",   primary: "#1E3A8A", secondary: "#0F172A", accent: "#94A3B8" },
  { name: "Steel Blue",      primary: "#0284C7", secondary: "#0C4A6E", accent: "#38BDF8" },
  { name: "Slate & White",   primary: "#475569", secondary: "#0F172A", accent: "#CBD5E1" },
  { name: "Indigo Pro",      primary: "#4F46E5", secondary: "#1E1B4B", accent: "#818CF8" },
  { name: "Midnight",        primary: "#1E293B", secondary: "#0F172A", accent: "#3B82F6" },
];

const luxury: ColorPreset[] = [
  { name: "Luxury Gold",    primary: "#D4AF37", secondary: "#1A1A2E", accent: "#C9A227" },
  { name: "Rose Gold",      primary: "#B76E79", secondary: "#1A0A0A", accent: "#E8C9B0" },
  { name: "Platinum",       primary: "#E5E4E2", secondary: "#2C2C2C", accent: "#D4AF37" },
  { name: "Emerald Elite",  primary: "#059669", secondary: "#022C22", accent: "#D4AF37" },
  { name: "Royal Purple",   primary: "#7C3AED", secondary: "#1A0A2E", accent: "#D4AF37" },
  { name: "Black & Gold",   primary: "#D4AF37", secondary: "#0A0A0A", accent: "#F5E6A3" },
];

const tech: ColorPreset[] = [
  { name: "Startup Purple", primary: "#8B5CF6", secondary: "#0F172A", accent: "#06B6D4" },
  { name: "Cyan Future",    primary: "#06B6D4", secondary: "#0C1445", accent: "#8B5CF6" },
  { name: "Neon Green",     primary: "#10B981", secondary: "#052E16", accent: "#34D399" },
  { name: "Electric Blue",  primary: "#3B82F6", secondary: "#0A0F2E", accent: "#A78BFA" },
  { name: "Deep Space",     primary: "#6366F1", secondary: "#020617", accent: "#22D3EE" },
  { name: "Matrix",         primary: "#22C55E", secondary: "#052E16", accent: "#86EFAC" },
];

const finance: ColorPreset[] = [
  { name: "Finance Gold",   primary: "#D4AF37", secondary: "#0F172A", accent: "#F59E0B" },
  { name: "Banking Navy",   primary: "#1E3A8A", secondary: "#0F0F23", accent: "#D4AF37" },
  { name: "Trust Green",    primary: "#047857", secondary: "#022C22", accent: "#6EE7B7" },
  { name: "Prestige",       primary: "#78350F", secondary: "#1C1003", accent: "#D97706" },
  { name: "Silver Fund",    primary: "#64748B", secondary: "#0F172A", accent: "#CBD5E1" },
  { name: "Classic Black",  primary: "#1C1917", secondary: "#0C0A09", accent: "#D4AF37" },
];

const medical: ColorPreset[] = [
  { name: "Medical Blue",   primary: "#0284C7", secondary: "#0C4A6E", accent: "#38BDF8" },
  { name: "Clean Teal",     primary: "#0D9488", secondary: "#042F2E", accent: "#2DD4BF" },
  { name: "Health Green",   primary: "#16A34A", secondary: "#052E16", accent: "#86EFAC" },
  { name: "Clinical White", primary: "#64748B", secondary: "#F1F5F9", accent: "#0284C7" },
  { name: "Calm Purple",    primary: "#7C3AED", secondary: "#1E1B4B", accent: "#C4B5FD" },
  { name: "Wellness",       primary: "#0891B2", secondary: "#164E63", accent: "#67E8F9" },
];

const realEstate: ColorPreset[] = [
  { name: "Estate Brown",   primary: "#92400E", secondary: "#1C1003", accent: "#D97706" },
  { name: "Property Red",   primary: "#B91C1C", secondary: "#1C0606", accent: "#F87171" },
  { name: "Land Green",     primary: "#15803D", secondary: "#052E16", accent: "#86EFAC" },
  { name: "Prestige Navy",  primary: "#1E3A8A", secondary: "#0F172A", accent: "#D4AF37" },
  { name: "Urban Grey",     primary: "#374151", secondary: "#111827", accent: "#9CA3AF" },
  { name: "Sunset Orange",  primary: "#C2410C", secondary: "#431407", accent: "#FB923C" },
];

const creative: ColorPreset[] = [
  { name: "Fashion Pink",   primary: "#EC4899", secondary: "#7C3AED", accent: "#F59E0B" },
  { name: "Tropical",       primary: "#F59E0B", secondary: "#7C3AED", accent: "#10B981" },
  { name: "Retro Pop",      primary: "#EF4444", secondary: "#7C3AED", accent: "#FBBF24" },
  { name: "Ocean Breeze",   primary: "#0EA5E9", secondary: "#1D4ED8", accent: "#F0F9FF" },
  { name: "Neon Night",     primary: "#A855F7", secondary: "#1E1B4B", accent: "#F472B6" },
  { name: "Citrus",         primary: "#EAB308", secondary: "#713F12", accent: "#FB923C" },
];

const minimal: ColorPreset[] = [
  { name: "Pure Black",     primary: "#0F172A", secondary: "#0F172A", accent: "#94A3B8" },
  { name: "Warm Grey",      primary: "#374151", secondary: "#111827", accent: "#9CA3AF" },
  { name: "Sage",           primary: "#4B5563", secondary: "#F9FAFB", accent: "#6B7280" },
  { name: "Soft Blue",      primary: "#3B82F6", secondary: "#F8FAFF", accent: "#BFDBFE" },
  { name: "Earthy",         primary: "#78716C", secondary: "#1C1917", accent: "#D6D3D1" },
  { name: "Mono",           primary: "#1E293B", secondary: "#F1F5F9", accent: "#64748B" },
];

const rdash: ColorPreset[] = [
  { name: "RDash Red",      primary: "#E63929", secondary: "#2D3650", accent: "#E63929" },
  { name: "RDash Navy",     primary: "#2D3650", secondary: "#1A2035", accent: "#E63929" },
  { name: "RDash Dark",     primary: "#E63929", secondary: "#1A1A2E", accent: "#FF6B6B" },
  { name: "RDash Steel",    primary: "#3B4B6B", secondary: "#1A2035", accent: "#E63929" },
  { name: "RDash Crimson",  primary: "#C41230", secondary: "#2D3650", accent: "#FF4444" },
  { name: "RDash Pro",      primary: "#E63929", secondary: "#0F172A", accent: "#FCA5A5" },
];

export const templateFormConfig: Record<string, TemplateFormConfig> = {
  "corporate-blue": {
    sectionLabel: "Personal Info",
    personal:  { showSlogan: false, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: true, showPhone: true, showMobile: true,  showAddress: true,  showEmail: true, showWebsite: true  },
    social:    ["linkedin"],
    showQR:    true,
    colorPresets: corporate,
  },
  "minimal-white": {
    sectionLabel: "Personal Info",
    personal:  { showSlogan: false, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: true, showPhone: true, showMobile: false, showAddress: false, showEmail: true, showWebsite: true  },
    social:    ["linkedin"],
    showQR:    false,
    colorPresets: minimal,
  },
  "dark-luxury": {
    sectionLabel: "Personal Info",
    personal:  { showSlogan: true, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: true, showPhone: true, showMobile: false, showAddress: false, showEmail: true, showWebsite: true  },
    social:    ["linkedin", "instagram"],
    showQR:    false,
    colorPresets: luxury,
  },
  "tech-modern": {
    sectionLabel: "Personal Info",
    personal:  { showSlogan: true, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: true, showPhone: true, showMobile: true,  showAddress: false, showEmail: true, showWebsite: true  },
    social:    ["linkedin", "twitter"],
    showQR:    true,
    colorPresets: tech,
  },
  "finance-gold": {
    sectionLabel: "Personal Info",
    personal:  { showSlogan: false, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: true, showPhone: true, showMobile: true,  showAddress: true,  showEmail: true, showWebsite: true  },
    social:    ["linkedin"],
    showQR:    true,
    colorPresets: finance,
  },
  "medical-clean": {
    sectionLabel: "Professional Info",
    personal:  { showSlogan: false, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: true, showPhone: true, showMobile: true,  showAddress: true,  showEmail: true, showWebsite: true  },
    social:    [],
    showQR:    true,
    colorPresets: medical,
  },
  "real-estate": {
    sectionLabel: "Agent Info",
    personal:  { showSlogan: true, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: true, showPhone: true, showMobile: true,  showAddress: true,  showEmail: true, showWebsite: true  },
    social:    ["linkedin", "facebook", "instagram"],
    showQR:    true,
    colorPresets: realEstate,
  },
  "creative-color": {
    sectionLabel: "About You",
    personal:  { showSlogan: true, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: false, showPhone: true, showMobile: false, showAddress: false, showEmail: true, showWebsite: true  },
    social:    ["instagram", "linkedin", "twitter", "youtube"],
    showQR:    true,
    colorPresets: creative,
  },
  "bold-chevron": {
    sectionLabel: "Personal Info",
    personal:  { showSlogan: false, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: true, showPhone: true, showMobile: false, showAddress: true,  showEmail: true, showWebsite: true  },
    social:    ["linkedin"],
    showQR:    true,
    colorPresets: corporate,
  },
  "rdash-pro": {
    sectionLabel: "Personal Info",
    personal:  { showSlogan: false, showLogoFront: true, showLogoBack: true },
    contact:   { showCompany: true, showPhone: true, showMobile: true,  showAddress: true,  showEmail: true, showWebsite: true  },
    social:    [],
    showQR:    true,
    colorPresets: rdash,
  },
  "custom-upload": {
    sectionLabel: "Personal Info",
    personal:  { showSlogan: true, showLogoFront: false, showLogoBack: false },
    contact:   { showCompany: true, showPhone: true, showMobile: true,  showAddress: true,  showEmail: true, showWebsite: true  },
    social:    ["linkedin", "instagram", "facebook", "twitter", "youtube"],
    showQR:    true,
    colorPresets: corporate,
  },
};

export const defaultTemplateFormConfig: TemplateFormConfig = {
  sectionLabel: "Personal Info",
  personal:  { showSlogan: true, showLogoFront: true, showLogoBack: true },
  contact:   { showCompany: true, showPhone: true, showMobile: true, showAddress: true, showEmail: true, showWebsite: true },
  social:    ["linkedin", "instagram", "facebook", "twitter", "youtube"],
  showQR:    true,
  colorPresets: corporate,
};

export const socialFieldMeta: Record<SocialField, { label: string; placeholder: string }> = {
  linkedin:  { label: "LinkedIn",    placeholder: "linkedin.com/in/yourname" },
  instagram: { label: "Instagram",   placeholder: "@yourhandle"              },
  twitter:   { label: "Twitter / X", placeholder: "@yourhandle"              },
  facebook:  { label: "Facebook",    placeholder: "facebook.com/yourpage"    },
  youtube:   { label: "YouTube",     placeholder: "youtube.com/@yourchannel" },
};
