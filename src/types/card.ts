export interface CardData {
  // Personal
  fullName: string;
  designation: string;
  company: string;

  // Contact
  phone: string;
  mobile: string;
  email: string;
  website: string;

  // Address
  address: string;

  // Social
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;

  // Branding
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;

  // Font sizes (percentage multiplier: 100 = default, 50–200 range)
  fontSizeName: number;
  fontSizeTitle: number;
  fontSizeDetails: number;

  // Slogan / tagline (separate from website URL)
  slogan: string;

  // Per-field font sizes (independent controls per input)
  fontSizeDesignation: number;
  fontSizeSlogan: number;
  fontSizeEmail: number;
  fontSizePhone: number;
  fontSizeAddress: number;
  fontSizeCompany: number;
  fontSizeWebsite: number;

  // Logo
  logoUrl: string | null;       // legacy fallback – used if logoUrlFront/Back are null
  logoUrlFront: string | null;  // logo shown on the front side
  logoUrlBack: string | null;   // logo shown on the back side
  logoSizeFront: number;        // percentage scale for front logo (default 100)
  logoSizeBack: number;         // percentage scale for back logo (default 100)
  logoText: string;

  // Custom template images
  customFrontImage: string | null;
  customBackImage: string | null;

  // QR Code
  showQR: boolean;
  qrCodeType: "website" | "linkedin" | "vcard" | "custom";
  qrCodeValue: string;

  // Background
  backgroundType: "solid" | "gradient";
  backgroundColor: string;

  // Card settings
  cardSize: "us" | "eu" | "india";
  isDoubleSided: boolean;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  isPremium: boolean;
  isDoubleSided: boolean;
  tags: string[];
  previewBg: string;
  defaultColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  defaultFont: string;
}

export type TemplateCategory =
  | "All"
  | "Corporate"
  | "Minimal"
  | "Luxury"
  | "Technology"
  | "Finance"
  | "Medical"
  | "Real Estate"
  | "Creative";

export type ExportFormat = "png" | "pdf" | "svg";
