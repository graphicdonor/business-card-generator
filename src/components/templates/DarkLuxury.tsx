"use client";

import { CardData } from "@/types/card";
import QRCodeBlock from "./QRCodeBlock";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function DarkLuxury({ data, side = "front", scale = 1 }: Props) {
  const W = 1050;
  const H = 600;
  const gold = data.primaryColor || "#D4AF37";
  const darkBg = data.secondaryColor || "#1A1A2E";
  const font = data.fontFamily || "Montserrat";
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
        <rect width={W} height={H} fill={darkBg} />
        {/* Corner decorations */}
        <path d="M0,0 L80,0 L80,4 L4,4 L4,80 L0,80 Z" fill={gold} opacity={0.6} />
        <path d={`M${W},0 L${W - 80},0 L${W - 80},4 L${W - 4},4 L${W - 4},80 L${W},80 Z`} fill={gold} opacity={0.6} />
        <path d={`M0,${H} L80,${H} L80,${H - 4} L4,${H - 4} L4,${H - 80} L0,${H - 80} Z`} fill={gold} opacity={0.6} />
        <path d={`M${W},${H} L${W - 80},${H} L${W - 80},${H - 4} L${W - 4},${H - 4} L${W - 4},${H - 80} L${W},${H - 80} Z`} fill={gold} opacity={0.6} />

        {/* Center monogram / logo */}
        {backLogo ? (
          <image href={backLogo} x={W/2 - 55*bls} y={H/2 - 35 - 55*bls} width={110*bls} height={110*bls} preserveAspectRatio="xMidYMid meet" />
        ) : (
          <text
            x={W / 2}
            y={H / 2 - 20}
            textAnchor="middle"
            dominantBaseline="central"
            fill={gold}
            fontSize={90}
            fontFamily={font}
            fontWeight="200"
            letterSpacing="10"
          >
            {data.logoText || data.company?.substring(0, 2).toUpperCase() || "LX"}
          </text>
        )}
        <line x1={W / 2 - 100} y1={H / 2 + 40} x2={W / 2 + 100} y2={H / 2 + 40} stroke={gold} strokeWidth={1} opacity={0.5} />
        <text x={W / 2} y={H / 2 + 70} textAnchor="middle" fill={gold} fontSize={14} fontFamily={font} letterSpacing="6" opacity={0.7}>
          {data.company?.toUpperCase() || "LUXURY BRAND"}
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
      <rect width={W} height={H} fill={darkBg} />

      {/* Subtle texture lines */}
      {[...Array(8)].map((_, i) => (
        <line
          key={i}
          x1={0}
          y1={i * 80}
          x2={W}
          y2={i * 80}
          stroke="white"
          strokeWidth={0.5}
          opacity={0.03}
        />
      ))}

      {/* Corner ornaments */}
      <path d="M0,0 L60,0 L60,3 L3,3 L3,60 L0,60 Z" fill={gold} opacity={0.7} />
      <path d={`M${W},0 L${W - 60},0 L${W - 60},3 L${W - 3},3 L${W - 3},60 L${W},60 Z`} fill={gold} opacity={0.7} />
      <path d={`M0,${H} L60,${H} L60,${H - 3} L3,${H - 3} L3,${H - 60} L0,${H - 60} Z`} fill={gold} opacity={0.7} />
      <path d={`M${W},${H} L${W - 60},${H} L${W - 60},${H - 3} L${W - 3},${H - 3} L${W - 3},${H - 60} L${W},${H - 60} Z`} fill={gold} opacity={0.7} />

      {/* Decorative circles */}
      <circle cx={W - 180} cy={H / 2} r={250} fill={gold} opacity={0.02} />
      <circle cx={W - 180} cy={H / 2} r={180} fill={gold} opacity={0.03} />

      {/* Left gold bar */}
      <rect x={60} y={80} width={2} height={H - 160} fill={gold} opacity={0.4} />

      {/* Monogram / logo */}
      {frontLogo ? (
        <image href={frontLogo} x={135 - 45*fls} y={133 - 40*fls} width={90*fls} height={80*fls} preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text x={90} y={165} fill={gold} fontSize={72} fontFamily={font} fontWeight="300" letterSpacing="4">
          {data.logoText || data.company?.substring(0, 2).toUpperCase() || "LX"}
        </text>
      )}

      {/* Gold separator */}
      <line x1={90} y1={190} x2={400} y2={190} stroke={gold} strokeWidth={1} opacity={0.4} />

      {/* Name */}
      <text x={90} y={260} fill="white" fontSize={40 * nScale} fontFamily={font} fontWeight="300" letterSpacing="3">
        {data.fullName || "Full Name"}
      </text>

      {/* Designation */}
      <text x={92} y={305} fill={gold} fontSize={15 * tScale} fontFamily={font} fontWeight="400" letterSpacing="4">
        {(data.designation || "Designation").toUpperCase()}
      </text>

      {/* Gold rule */}
      <line x1={90} y1={330} x2={340} y2={330} stroke={gold} strokeWidth={0.5} opacity={0.5} />

      {/* Contact */}
      <text x={90} y={365} fill="#CBD5E1" fontSize={14 * dScale} fontFamily={font} letterSpacing="1">
        {data.email || "email@luxury.com"}
      </text>
      <text x={90} y={393} fill="#CBD5E1" fontSize={14 * dScale} fontFamily={font} letterSpacing="1">
        {data.phone || data.mobile || "+1 (555) 000-0000"}
      </text>
      <text x={90} y={421} fill="#CBD5E1" fontSize={14 * dScale} fontFamily={font} letterSpacing="1">
        {data.website || "www.luxury.com"}
      </text>
      {data.address && (
        <text x={90} y={449} fill="#94A3B8" fontSize={12 * dScale} fontFamily={font}>
          {data.address.length > 55 ? data.address.substring(0, 55) + "..." : data.address}
        </text>
      )}

      {/* QR code - lower left */}
      <QRCodeBlock data={data} x={90} y={465} size={100} darkColor="#ffffff" lightColor={darkBg} />

      {/* Right side - company */}
      <text
        x={W - 80}
        y={H / 2}
        textAnchor="middle"
        fill={gold}
        fontSize={13 * tScale}
        fontFamily={font}
        fontWeight="300"
        letterSpacing="4"
        transform={`rotate(-90, ${W - 80}, ${H / 2})`}
      >
        {data.company?.toUpperCase() || "COMPANY NAME"}
      </text>
    </svg>
  );
}
