"use client";

import { CardData } from "@/types/card";
import QRCodeBlock from "./QRCodeBlock";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function TechModern({ data, side = "front", scale = 1 }: Props) {
  const W = 1050;
  const H = 600;
  const primary = data.primaryColor || "#8B5CF6";
  const darkBg = data.secondaryColor || "#0F172A";
  const accent = data.accentColor || "#06B6D4";
  const font = data.fontFamily || "Manrope";
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
          <linearGradient id="techBackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={darkBg} />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <clipPath id="techBackLogoClip">
            <polygon points={`${W / 2},${H / 2 - 70} ${W / 2 + 60},${H / 2 - 35} ${W / 2 + 60},${H / 2 + 35} ${W / 2},${H / 2 + 70} ${W / 2 - 60},${H / 2 + 35} ${W / 2 - 60},${H / 2 - 35}`} />
          </clipPath>
        </defs>
        <rect width={W} height={H} fill="url(#techBackGrad)" />

        {/* Grid pattern */}
        {[...Array(15)].map((_, i) => (
          <line key={`v${i}`} x1={i * 75} y1={0} x2={i * 75} y2={H} stroke="white" strokeWidth={0.5} opacity={0.04} />
        ))}
        {[...Array(9)].map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 75} x2={W} y2={i * 75} stroke="white" strokeWidth={0.5} opacity={0.04} />
        ))}

        {/* Center hex */}
        <polygon
          points={`${W / 2},${H / 2 - 100} ${W / 2 + 87},${H / 2 - 50} ${W / 2 + 87},${H / 2 + 50} ${W / 2},${H / 2 + 100} ${W / 2 - 87},${H / 2 + 50} ${W / 2 - 87},${H / 2 - 50}`}
          fill={primary}
          opacity={0.2}
        />
        <polygon
          points={`${W / 2},${H / 2 - 70} ${W / 2 + 60},${H / 2 - 35} ${W / 2 + 60},${H / 2 + 35} ${W / 2},${H / 2 + 70} ${W / 2 - 60},${H / 2 + 35} ${W / 2 - 60},${H / 2 - 35}`}
          fill={primary}
          opacity={0.3}
        />
        {backLogo ? (
          <image href={backLogo} x={W/2 - 60*bls} y={H/2 - 70*bls} width={120*bls} height={140*bls} clipPath="url(#techBackLogoClip)" preserveAspectRatio="xMidYMid meet" />
        ) : (
          <>
            <text x={W / 2} y={H / 2 - 10} textAnchor="middle" fill="white" fontSize={38} fontFamily={font} fontWeight="800">
              {data.logoText || data.company?.substring(0, 2).toUpperCase() || "TM"}
            </text>
            <text x={W / 2} y={H / 2 + 25} textAnchor="middle" fill={accent} fontSize={12} fontFamily={font} letterSpacing="4">
              TECH
            </text>
          </>
        )}

        <text x={W / 2} y={H / 2 + 120} textAnchor="middle" fill="white" fontSize={16} fontFamily={font} fontWeight="600" opacity={0.7}>
          {data.company || "Company Name"}
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={darkBg} />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <clipPath id="techFrontLogoClip">
          <polygon points="100,50 135,70 135,110 100,130 65,110 65,70" />
        </clipPath>
      </defs>
      <rect width={W} height={H} fill="url(#techGrad)" />

      {/* Subtle grid */}
      {[...Array(15)].map((_, i) => (
        <line key={`v${i}`} x1={i * 75} y1={0} x2={i * 75} y2={H} stroke="white" strokeWidth={0.5} opacity={0.04} />
      ))}
      {[...Array(9)].map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 75} x2={W} y2={i * 75} stroke="white" strokeWidth={0.5} opacity={0.04} />
      ))}

      {/* Top accent gradient bar */}
      <rect x={0} y={0} width={W} height={4} fill="url(#accentGrad)" />

      {/* Left circuit decoration */}
      <circle cx={60} cy={80} r={20} fill="none" stroke={primary} strokeWidth={2} opacity={0.4} />
      <circle cx={60} cy={80} r={6} fill={primary} opacity={0.6} />
      <line x1={60} y1={100} x2={60} y2={160} stroke={primary} strokeWidth={2} opacity={0.3} />
      <line x1={60} y1={160} x2={100} y2={160} stroke={primary} strokeWidth={2} opacity={0.3} />
      <circle cx={100} cy={160} r={4} fill={accent} opacity={0.6} />

      {/* Logo in hex */}
      <polygon
        points={`100,50 135,70 135,110 100,130 65,110 65,70`}
        fill={primary}
        opacity={0.8}
      />
      {frontLogo ? (
        <image href={frontLogo} x={100 - 35*fls} y={90 - 40*fls} width={70*fls} height={80*fls} clipPath="url(#techFrontLogoClip)" preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text x={100} y={95} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={24} fontFamily={font} fontWeight="800">
          {data.logoText || data.company?.substring(0, 2).toUpperCase() || "TM"}
        </text>
      )}

      {/* Name */}
      <text x={170} y={100} fill="white" fontSize={42 * nScale} fontFamily={font} fontWeight="800">
        {data.fullName || "Full Name"}
      </text>

      {/* Gradient underline */}
      <rect x={170} y={115} width={400} height={2} fill="url(#accentGrad)" rx={1} />

      {/* Designation */}
      <text x={170} y={150} fill={accent} fontSize={16 * tScale} fontFamily={font} fontWeight="500" letterSpacing="2">
        {(data.designation || "Designation").toUpperCase()}
      </text>

      <text x={170} y={178} fill="#94A3B8" fontSize={13 * tScale} fontFamily={font}>
        {data.company || "Company Name"}
      </text>

      {/* Contact section */}
      <rect x={60} y={230} width={W - 120} height={1} fill="white" opacity={0.07} />

      {/* Contact items */}
      <g transform="translate(60, 255)">
        {/* Email */}
        <rect x={0} y={0} width={3} height={22} fill={accent} rx={1} />
        <text x={16} y={16} fill="#CBD5E1" fontSize={15 * dScale} fontFamily={font}>
          {data.email || "email@tech.com"}
        </text>

        {/* Phone */}
        <rect x={0} y={38} width={3} height={22} fill={primary} rx={1} />
        <text x={16} y={54} fill="#CBD5E1" fontSize={15 * dScale} fontFamily={font}>
          {data.phone || data.mobile || "+1 (555) 000-0000"}
        </text>

        {/* Website */}
        <rect x={0} y={76} width={3} height={22} fill={accent} rx={1} />
        <text x={16} y={92} fill="#CBD5E1" fontSize={15 * dScale} fontFamily={font}>
          {data.website || "www.tech.com"}
        </text>

        {/* LinkedIn */}
        {data.linkedin && (
          <>
            <rect x={0} y={114} width={3} height={22} fill={primary} rx={1} />
            <text x={16} y={130} fill="#94A3B8" fontSize={13 * dScale} fontFamily={font}>
              {data.linkedin}
            </text>
          </>
        )}
      </g>

      {/* Address */}
      {data.address && (
        <text x={60} y={H - 30} fill="#475569" fontSize={12 * dScale} fontFamily={font}>
          {data.address.length > 65 ? data.address.substring(0, 65) + "..." : data.address}
        </text>
      )}

      {/* QR code - lower right */}
      <QRCodeBlock data={data} x={W - 200} y={370} size={110} darkColor="#ffffff" lightColor={darkBg} />

      {/* Right decorative element */}
      <circle cx={W - 80} cy={H - 80} r={120} fill={primary} opacity={0.05} />
      <circle cx={W - 80} cy={H - 80} r={80} fill={primary} opacity={0.07} />
      <circle cx={W - 80} cy={H - 80} r={40} fill={primary} opacity={0.1} />

      {/* Bottom gradient bar */}
      <rect x={0} y={H - 4} width={W} height={4} fill="url(#accentGrad)" />
    </svg>
  );
}
