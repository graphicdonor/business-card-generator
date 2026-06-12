"use client";

import { CardData } from "@/types/card";
import QRCodeBlock from "./QRCodeBlock";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function CreativeVibrant({ data, side = "front", scale = 1 }: Props) {
  const W = 1050;
  const H = 600;
  const pink = data.primaryColor || "#EC4899";
  const violet = data.secondaryColor || "#7C3AED";
  const yellow = data.accentColor || "#F59E0B";
  const font = data.fontFamily || "DM Sans";
  const nScale = (data.fontSizeName ?? 100) / 100;
  const tScale = (data.fontSizeTitle ?? 100) / 100;
  const dScale = (data.fontSizeDetails ?? 100) / 100;
  const frontLogo = data.logoUrlFront ?? data.logoUrl;
  const backLogo = data.logoUrlBack ?? data.logoUrl;
  const fls = (data.logoSizeFront ?? 100) / 100;
  const bls = (data.logoSizeBack ?? 100) / 100;

  if (side === "back") {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="creBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={violet} />
            <stop offset="100%" stopColor={pink} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#creBackGrad)" />

        {/* Geometric shapes */}
        <circle cx={200} cy={150} r={120} fill="white" opacity={0.07} />
        <circle cx={W - 200} cy={H - 150} r={160} fill="white" opacity={0.05} />
        <polygon points={`${W / 2 - 60},${H / 2 - 80} ${W / 2 + 60},${H / 2 - 80} ${W / 2 + 80},${H / 2 + 60} ${W / 2},${H / 2 + 90} ${W / 2 - 80},${H / 2 + 60}`} fill="white" opacity={0.1} />

        {backLogo ? (
          <image href={backLogo} x={W/2 - 70*bls} y={H/2 - 35 - 55*bls} width={140*bls} height={110*bls} preserveAspectRatio="xMidYMid meet" />
        ) : (
          <text x={W / 2} y={H / 2 - 30} textAnchor="middle" fill="white" fontSize={60} fontFamily={font} fontWeight="800">
            {data.logoText || data.company?.substring(0, 2).toUpperCase() || "CV"}
          </text>
        )}
        <rect x={W / 2 - 40} y={H / 2 + 5} width={80} height={4} fill={yellow} rx={2} />
        <text x={W / 2} y={H / 2 + 50} textAnchor="middle" fill="white" fontSize={16} fontFamily={font} fontWeight="600" opacity={0.9}>
          {data.company || "Creative Studio"}
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="creGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={violet} />
          <stop offset="100%" stopColor={pink} />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="white" />

      {/* Left gradient panel */}
      <rect x={0} y={0} width={380} height={H} fill="url(#creGrad)" />

      {/* Decorative circles on left panel */}
      <circle cx={190} cy={-50} r={200} fill="white" opacity={0.06} />
      <circle cx={50} cy={H - 50} r={150} fill="white" opacity={0.06} />

      {/* Left panel content */}
      {/* Big number/monogram */}
      <text
        x={190}
        y={220}
        textAnchor="middle"
        fill="white"
        fontSize={120}
        fontFamily={font}
        fontWeight="900"
        opacity={0.15}
      >
        {data.logoText || data.company?.substring(0, 1).toUpperCase() || "C"}
      </text>

      {frontLogo ? (
        <image href={frontLogo} x={190 - 65*fls} y={220 - 50*fls} width={130*fls} height={100*fls} preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text
          x={190}
          y={230}
          textAnchor="middle"
          fill="white"
          fontSize={56}
          fontFamily={font}
          fontWeight="800"
        >
          {data.logoText || data.company?.substring(0, 2).toUpperCase() || "CV"}
        </text>
      )}

      <rect x={110} y={250} width={160} height={3} fill={yellow} rx={1} />

      <text x={190} y={285} textAnchor="middle" fill="white" fontSize={13} fontFamily={font} fontWeight="600" letterSpacing="3" opacity={0.9}>
        {data.company?.toUpperCase() || "CREATIVE"}
      </text>
      <text x={190} y={310} textAnchor="middle" fill="white" fontSize={11} fontFamily={font} opacity={0.6} letterSpacing="2">
        STUDIO
      </text>

      {/* Right side */}
      {/* Name */}
      <text x={425} y={160} fill="#0F172A" fontSize={46 * nScale} fontFamily={font} fontWeight="900">
        {(data.fullName || "Full Name").split(" ")[0]}
      </text>
      <text x={427} y={215} fill="#334155" fontSize={46 * nScale} fontFamily={font} fontWeight="300">
        {(data.fullName || "Full Name").split(" ").slice(1).join(" ")}
      </text>

      {/* Yellow accent */}
      <rect x={425} y={230} width={80} height={4} fill={yellow} rx={2} />

      {/* Designation */}
      <text x={425} y={270} fill={violet} fontSize={17 * tScale} fontFamily={font} fontWeight="700">
        {data.designation || "Creative Director"}
      </text>

      {/* Contact pills */}
      <g transform="translate(425, 310)">
        <rect x={0} y={0} width={280} height={32} rx={16} fill={pink} opacity={0.1} />
        {/* Envelope icon */}
        <g transform="translate(12, 10)">
          <rect x={0} y={0} width={14} height={10} rx={1.5} fill="none" stroke="#374151" strokeWidth={1.2} />
          <path d="M0,0.5 L7,6.5 L14,0.5" fill="none" stroke="#374151" strokeWidth={1.2} strokeLinejoin="round" />
        </g>
        <text x={34} y={21} fill="#374151" fontSize={14 * dScale} fontFamily={font}>
          {data.email || "hello@creative.com"}
        </text>
      </g>

      <g transform="translate(425, 355)">
        <rect x={0} y={0} width={240} height={32} rx={16} fill={violet} opacity={0.1} />
        {/* Phone icon */}
        <g transform="translate(13, 8)">
          <path d="M2.5,0.5 L4.5,0.5 C5,0.5 5.5,1 5.5,1.5 L5.5,3.5 C5.5,4 5,4.5 4.5,4.5 L4,4.8 C4.7,6 5.8,7 7,7.5 L7.3,7 C7.8,6.5 8.3,6.5 8.8,7 L10.5,8.5 C11,9 11,9.5 10.5,10 L9.5,11 C9,11.5 8.5,11.5 8,11 C5,8.5 1,4.5 1,2 C1,1.5 1.5,0.5 2.5,0.5 Z" fill="none" stroke="#374151" strokeWidth={1.2} strokeLinejoin="round" />
        </g>
        <text x={34} y={21} fill="#374151" fontSize={14 * dScale} fontFamily={font}>
          {data.phone || data.mobile || "+1 (555) 000-0000"}
        </text>
      </g>

      <g transform="translate(425, 400)">
        <rect x={0} y={0} width={260} height={32} rx={16} fill={yellow} opacity={0.2} />
        {/* Globe icon */}
        <g transform="translate(12, 8)">
          <circle cx={8} cy={8} r={7} fill="none" stroke="#374151" strokeWidth={1.2} />
          <ellipse cx={8} cy={8} rx={4} ry={7} fill="none" stroke="#374151" strokeWidth={1} />
          <line x1={1} y1={8} x2={15} y2={8} stroke="#374151" strokeWidth={1} />
          <path d="M2,5 Q8,6.5 14,5" fill="none" stroke="#374151" strokeWidth={0.9} />
          <path d="M2,11 Q8,9.5 14,11" fill="none" stroke="#374151" strokeWidth={0.9} />
        </g>
        <text x={34} y={21} fill="#374151" fontSize={14 * dScale} fontFamily={font}>
          {data.website || "www.creative.com"}
        </text>
      </g>

      {/* Social links */}
      {data.instagram && (
        <g transform="translate(425, 445)">
          {/* Instagram icon */}
          <g transform="translate(0, 2)">
            <rect x={0} y={0} width={16} height={16} rx={4} fill="none" stroke="#94A3B8" strokeWidth={1.2} />
            <circle cx={8} cy={8} r={3.5} fill="none" stroke="#94A3B8" strokeWidth={1.1} />
            <circle cx={12.5} cy={3.5} r={1.2} fill="#94A3B8" />
          </g>
          <text x={24} y={16} fill="#94A3B8" fontSize={12 * dScale} fontFamily={font}>
            {data.instagram}
          </text>
        </g>
      )}

      {/* QR code - lower right */}
      <QRCodeBlock data={data} x={W - 185} y={440} size={110} darkColor={violet} lightColor="#ffffff" />

      {/* Decorative dots */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={W - 60} cy={60 + i * 25} r={5} fill={pink} opacity={0.4} />
      ))}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={W - 30} cy={48 + i * 25} r={5} fill={violet} opacity={0.3} />
      ))}
    </svg>
  );
}
