"use client";

import { CardData } from "@/types/card";
import QRCodeBlock from "./QRCodeBlock";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function FinanceGold({ data, side = "front", scale = 1 }: Props) {
  const W = 1050;
  const H = 600;
  const gold = data.primaryColor || "#B8972A";
  const navy = data.secondaryColor || "#0C1B33";
  const lightGold = data.accentColor || "#E8C547";
  const font = data.fontFamily || "Poppins";
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
          <linearGradient id="finBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={navy} />
            <stop offset="100%" stopColor="#1A2F52" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#finBackGrad)" />

        {/* Gold border frame */}
        <rect x={20} y={20} width={W - 40} height={H - 40} rx={4} fill="none" stroke={gold} strokeWidth={1.5} />
        <rect x={28} y={28} width={W - 56} height={H - 56} rx={3} fill="none" stroke={gold} strokeWidth={0.5} opacity={0.4} />

        {/* Crest/emblem area */}
        <polygon
          points={`${W / 2 - 50},${H / 2 - 80} ${W / 2 + 50},${H / 2 - 80} ${W / 2 + 70},${H / 2 - 20} ${W / 2},${H / 2 + 70} ${W / 2 - 70},${H / 2 - 20}`}
          fill={gold}
          opacity={0.15}
        />
        <polygon
          points={`${W / 2 - 35},${H / 2 - 60} ${W / 2 + 35},${H / 2 - 60} ${W / 2 + 50},${H / 2 - 15} ${W / 2},${H / 2 + 50} ${W / 2 - 50},${H / 2 - 15}`}
          fill={gold}
          opacity={0.2}
        />

        {backLogo ? (
          <image href={backLogo} x={W/2 - 55*bls} y={H/2 - 15 - 55*bls} width={110*bls} height={110*bls} preserveAspectRatio="xMidYMid meet" />
        ) : (
          <text x={W / 2} y={H / 2 - 10} textAnchor="middle" dominantBaseline="central" fill={gold} fontSize={52} fontFamily={font} fontWeight="700">
            {data.logoText || data.company?.substring(0, 2).toUpperCase() || "FG"}
          </text>
        )}
        <text x={W / 2} y={H / 2 + 60} textAnchor="middle" fill="white" fontSize={14} fontFamily={font} fontWeight="600" letterSpacing="5" opacity={0.8}>
          {data.company?.toUpperCase() || "FINANCE GROUP"}
        </text>
        <line x1={W / 2 - 80} y1={H / 2 + 80} x2={W / 2 + 80} y2={H / 2 + 80} stroke={gold} strokeWidth={1} opacity={0.4} />
        <text x={W / 2} y={H / 2 + 105} textAnchor="middle" fill={gold} fontSize={11} fontFamily={font} letterSpacing="3" opacity={0.6}>
          EST. 2024
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="finGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={navy} />
          <stop offset="100%" stopColor="#1A2F52" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={gold} />
          <stop offset="50%" stopColor={lightGold} />
          <stop offset="100%" stopColor={gold} />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill="url(#finGrad)" />

      {/* Gold decorative left panel */}
      <rect x={0} y={0} width={260} height={H} fill={gold} opacity={0.08} />
      <rect x={258} y={0} width={2} height={H} fill="url(#goldGrad)" opacity={0.6} />

      {/* Top gold bar */}
      <rect x={0} y={0} width={W} height={6} fill="url(#goldGrad)" />
      <rect x={0} y={H - 6} width={W} height={6} fill="url(#goldGrad)" />

      {/* Left panel content */}
      {/* Monogram / logo */}
      {frontLogo ? (
        <image href={frontLogo} x={130 - 50*fls} y={165 - 45*fls} width={100*fls} height={90*fls} preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text
          x={130}
          y={200}
          textAnchor="middle"
          fill={lightGold}
          fontSize={80}
          fontFamily={font}
          fontWeight="700"
        >
          {data.logoText || data.company?.substring(0, 2).toUpperCase() || "FG"}
        </text>
      )}

      {/* Divider */}
      <line x1={40} y1={230} x2={220} y2={230} stroke={gold} strokeWidth={1} opacity={0.5} />

      <text x={130} y={260} textAnchor="middle" fill={gold} fontSize={11} fontFamily={font} letterSpacing="3" fontWeight="600">
        {data.company?.toUpperCase() || "FINANCE GROUP"}
      </text>
      <text x={130} y={285} textAnchor="middle" fill="#94A3B8" fontSize={10} fontFamily={font} letterSpacing="2">
        EST. 2024
      </text>

      {/* Right content */}
      {/* Name */}
      <text x={310} y={140} fill="white" fontSize={44 * nScale} fontFamily={font} fontWeight="600">
        {data.fullName || "Full Name"}
      </text>
      <text x={312} y={175} fill={lightGold} fontSize={16 * tScale} fontFamily={font} fontWeight="400" letterSpacing="3">
        {(data.designation || "Designation").toUpperCase()}
      </text>

      {/* Gold rule */}
      <rect x={310} y={198} width={W - 360} height={1} fill="url(#goldGrad)" opacity={0.5} />

      {/* Contact info */}
      {/* Email */}
      <g transform="translate(310, 224)">
        <rect x={0} y={0} width={14} height={10} rx={1.5} fill="none" stroke="#CBD5E1" strokeWidth={1.2} />
        <path d="M0,0.5 L7,6.5 L14,0.5" fill="none" stroke="#CBD5E1" strokeWidth={1.2} strokeLinejoin="round" />
        <text x={22} y={9} fill="#CBD5E1" fontSize={14 * dScale} fontFamily={font}>
          {data.email || "email@finance.com"}
        </text>
      </g>
      {/* Phone */}
      <g transform="translate(310, 256)">
        <path d="M2,0 L4,0 C4.5,0 5,0.5 5,1 L5,3 C5,3.5 4.5,4 4,4 L3.5,4.3 C4.2,5.5 5.3,6.5 6.5,7 L6.8,6.5 C7.3,6 7.8,6 8.3,6.5 L10,8 C10.5,8.5 10.5,9 10,9.5 L9,10.5 C8.5,11 8,11 7.5,10.5 C4.5,8 0.5,4 0.5,1.5 C0.5,0.7 1.2,0 2,0 Z" fill="none" stroke="#CBD5E1" strokeWidth={1.2} strokeLinejoin="round" />
        <text x={22} y={9} fill="#CBD5E1" fontSize={14 * dScale} fontFamily={font}>
          {data.phone || data.mobile || "+1 (555) 000-0000"}
        </text>
      </g>
      {/* Website */}
      <g transform="translate(310, 290)">
        <circle cx={7} cy={7} r={6.5} fill="none" stroke="#CBD5E1" strokeWidth={1.2} />
        <ellipse cx={7} cy={7} rx={3.5} ry={6.5} fill="none" stroke="#CBD5E1" strokeWidth={1} />
        <line x1={0.5} y1={7} x2={13.5} y2={7} stroke="#CBD5E1" strokeWidth={1} />
        <path d="M1.5,4.5 Q7,5.8 12.5,4.5" fill="none" stroke="#CBD5E1" strokeWidth={0.9} />
        <path d="M1.5,9.5 Q7,8.2 12.5,9.5" fill="none" stroke="#CBD5E1" strokeWidth={0.9} />
        <text x={22} y={10} fill="#CBD5E1" fontSize={14 * dScale} fontFamily={font}>
          {data.website || "www.finance.com"}
        </text>
      </g>
      {/* LinkedIn */}
      {data.linkedin && (
        <g transform="translate(310, 322)">
          <rect x={0} y={0} width={14} height={14} rx={2} fill="none" stroke="#94A3B8" strokeWidth={1.2} />
          <line x1={3.5} y1={6} x2={3.5} y2={11} stroke="#94A3B8" strokeWidth={1.3} />
          <circle cx={3.5} cy={3.8} r={1.1} fill="#94A3B8" />
          <path d="M7,6 L7,11 M7,8 C7,6.5 12,6.5 12,8.5 L12,11" fill="none" stroke="#94A3B8" strokeWidth={1.3} />
          <text x={22} y={10} fill="#94A3B8" fontSize={13 * dScale} fontFamily={font}>
            {data.linkedin}
          </text>
        </g>
      )}

      {/* Address */}
      {data.address && (
        <g transform={`translate(310, ${H - 48})`}>
          <path d="M5,0 C2.5,0 0.5,2 0.5,4.5 C0.5,8 5,13.5 5,13.5 C5,13.5 9.5,8 9.5,4.5 C9.5,2 7.5,0 5,0 Z M5,6 C4.2,6 3.5,5.3 3.5,4.5 C3.5,3.7 4.2,3 5,3 C5.8,3 6.5,3.7 6.5,4.5 C6.5,5.3 5.8,6 5,6 Z" fill="none" stroke="#64748B" strokeWidth={1.2} />
          <text x={18} y={9} fill="#64748B" fontSize={12 * dScale} fontFamily={font}>
            {data.address.length > 60 ? data.address.substring(0, 60) + "..." : data.address}
          </text>
        </g>
      )}

      {/* QR code - left panel lower area */}
      <QRCodeBlock data={data} x={75} y={330} size={110} darkColor={lightGold} lightColor={navy} />

      {/* Decorative bottom right */}
      <circle cx={W - 60} cy={H - 60} r={100} fill={gold} opacity={0.04} />
    </svg>
  );
}
