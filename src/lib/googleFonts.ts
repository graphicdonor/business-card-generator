export interface GoogleFont {
  name: string;
  category: "sans-serif" | "serif" | "display" | "monospace";
  weights: string;
}

export const googleFonts: GoogleFont[] = [
  // Sans-serif
  { name: "Inter", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Poppins", category: "sans-serif", weights: "300;400;500;600;700;800" },
  { name: "Roboto", category: "sans-serif", weights: "300;400;500;700" },
  { name: "Manrope", category: "sans-serif", weights: "300;400;500;600;700;800" },
  { name: "Montserrat", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Plus Jakarta Sans", category: "sans-serif", weights: "300;400;500;600;700;800" },
  { name: "DM Sans", category: "sans-serif", weights: "300;400;500;600;700" },
  { name: "Nunito", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Lato", category: "sans-serif", weights: "300;400;700;900" },
  { name: "Open Sans", category: "sans-serif", weights: "300;400;500;600;700;800" },
  { name: "Raleway", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Outfit", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Quicksand", category: "sans-serif", weights: "300;400;500;600;700" },
  { name: "Josefin Sans", category: "sans-serif", weights: "300;400;500;600;700" },
  { name: "Barlow", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Figtree", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Syne", category: "sans-serif", weights: "400;500;600;700;800" },
  { name: "Space Grotesk", category: "sans-serif", weights: "300;400;500;600;700" },
  { name: "IBM Plex Sans", category: "sans-serif", weights: "300;400;500;600;700" },
  { name: "Work Sans", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Urbanist", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Be Vietnam Pro", category: "sans-serif", weights: "300;400;500;600;700;800;900" },
  { name: "Karla", category: "sans-serif", weights: "300;400;500;600;700;800" },
  { name: "Mulish", category: "sans-serif", weights: "300;400;500;600;700;800;900" },

  // Serif
  { name: "Playfair Display", category: "serif", weights: "400;500;600;700;800;900" },
  { name: "Merriweather", category: "serif", weights: "300;400;700;900" },
  { name: "Lora", category: "serif", weights: "400;500;600;700" },
  { name: "EB Garamond", category: "serif", weights: "400;500;600;700;800" },
  { name: "Cormorant Garamond", category: "serif", weights: "300;400;500;600;700" },
  { name: "DM Serif Display", category: "serif", weights: "400" },
  { name: "Libre Baskerville", category: "serif", weights: "400;700" },
  { name: "Crimson Text", category: "serif", weights: "400;600;700" },
  { name: "Spectral", category: "serif", weights: "300;400;500;600;700;800" },
  { name: "Vollkorn", category: "serif", weights: "400;500;600;700;800;900" },
  { name: "Bitter", category: "serif", weights: "300;400;500;600;700;800;900" },

  // Display
  { name: "Bebas Neue", category: "display", weights: "400" },
  { name: "Oswald", category: "display", weights: "300;400;500;600;700" },
  { name: "Anton", category: "display", weights: "400" },
  { name: "Righteous", category: "display", weights: "400" },
  { name: "Exo 2", category: "display", weights: "300;400;500;600;700;800;900" },
  { name: "Cinzel", category: "display", weights: "400;500;600;700;800;900" },
  { name: "Abril Fatface", category: "display", weights: "400" },
  { name: "Kanit", category: "display", weights: "300;400;500;600;700;800;900" },
  { name: "Titan One", category: "display", weights: "400" },
  { name: "Unbounded", category: "display", weights: "300;400;500;600;700;800;900" },

  // Monospace
  { name: "Space Mono", category: "monospace", weights: "400;700" },
  { name: "IBM Plex Mono", category: "monospace", weights: "300;400;500;600;700" },
  { name: "Fira Code", category: "monospace", weights: "300;400;500;600;700" },
  { name: "JetBrains Mono", category: "monospace", weights: "300;400;500;600;700;800" },
];

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontName: string, weights = "300;400;500;600;700;800"): void {
  if (typeof document === "undefined") return;
  if (loadedFonts.has(fontName)) return;

  const fontEntry = googleFonts.find((f) => f.name === fontName);
  const fontWeights = fontEntry?.weights ?? weights;

  const family = fontName.replace(/ /g, "+");
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${fontWeights}&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);

  loadedFonts.add(fontName);
}

export function preloadCommonFonts(): void {
  const common = ["Inter", "Poppins", "Montserrat", "Playfair Display", "DM Sans"];
  common.forEach((f) => loadGoogleFont(f));
}
