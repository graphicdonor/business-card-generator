"use client";

import { CardData } from "@/types/card";
import QRCodeBlock from "./QRCodeBlock";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function MinimalWhite({ data, side = "front", scale = 1 }: Props) {
  const W = 1050;
  const H = 600;
  const primary = data.primaryColor || "#0F172A";
  const accent = data.accentColor || "#3B82F6";
  const font = data.fontFamily || "Plus Jakarta Sans";
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
        <rect width={W} height={H} fill="white" />
        <rect x={40} y={40} width={W - 80} height={H - 80} rx={4} fill="none" stroke="#E2E8F0" strokeWidth={1} />

        {/* Logo */}
        {backLogo ? (
          <image href={backLogo} x={W/2 - 70*bls} y={H/2 - 40 - 40*bls} width={140*bls} height={80*bls} preserveAspectRatio="xMidYMid meet" />
        ) : (
          <text x={W / 2} y={H / 2 - 30} textAnchor="middle" fill={primary} fontSize={64} fontFamily={font} fontWeight="800">
            {data.logoText || data.company?.substring(0, 2).toUpperCase() || "CO"}
          </text>
        )}
        <rect x={W / 2 - 60} y={H / 2 + 5} width={120} height={2} fill={accent} />
        <text x={W / 2} y={H / 2 + 45} textAnchor="middle" fill="#64748B" fontSize={16} fontFamily={font} letterSpacing="4">
          {data.company?.toUpperCase() || "COMPANY"}
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width={W} height={H} fill="white" />

      {/* Left accent bar */}
      <rect x={0} y={0} width={6} height={H} fill={accent} />

      {/* Logo area - top left */}
      {frontLogo ? (
        <image href={frontLogo} x={115 - 45*fls} y={85.5 - 27.5*fls} width={90*fls} height={55*fls} preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text x={70} y={100} fill={primary} fontSize={42} fontFamily={font} fontWeight="800">
          {data.logoText || data.company?.substring(0, 2).toUpperCase() || "CO"}
        </text>
      )}

      {/* Top right - company */}
      <text x={W - 60} y={80} textAnchor="end" fill="#94A3B8" fontSize={13} fontFamily={font} letterSpacing="3">
        {data.company?.toUpperCase() || "COMPANY NAME"}
      </text>
      <line x1={W - 200} y1={90} x2={W - 60} y2={90} stroke="#E2E8F0" strokeWidth={1} />

      {/* Main name */}
      <text x={70} y={230} fill={primary} fontSize={52 * nScale} fontFamily={font} fontWeight="700" letterSpacing="-1">
        {(data.fullName || "Full Name").split(" ")[0]}
      </text>
      <text x={70} y={290} fill={primary} fontSize={52 * nScale} fontFamily={font} fontWeight="300">
        {(data.fullName || "Full Name").split(" ").slice(1).join(" ")}
      </text>

      {/* Designation */}
      <text x={70} y={340} fill={accent} fontSize={17 * tScale} fontFamily={font} fontWeight="500" letterSpacing="1">
        {data.designation || "Your Designation"}
      </text>

      {/* Divider */}
      <line x1={70} y1={370} x2={350} y2={370} stroke="#E2E8F0" strokeWidth={1} />

      {/* Contact info */}
      <text x={70} y={400} fill="#475569" fontSize={15 * dScale} fontFamily={font}>
        {data.email || "email@company.com"}
      </text>
      <text x={70} y={428} fill="#475569" fontSize={15 * dScale} fontFamily={font}>
        {data.phone || data.mobile || "+1 (555) 000-0000"}
      </text>
      <text x={70} y={456} fill="#475569" fontSize={15 * dScale} fontFamily={font}>
        {data.website || "www.company.com"}
      </text>

      {/* Right side - decorative */}
      <circle cx={W - 100} cy={H / 2} r={200} fill={accent} opacity={0.03} />
      <circle cx={W - 100} cy={H / 2} r={140} fill={accent} opacity={0.04} />
      <circle cx={W - 100} cy={H / 2} r={80} fill={accent} opacity={0.06} />

      {/* QR code - lower right */}
      <QRCodeBlock data={data} x={W - 185} y={390} size={110} darkColor={primary} lightColor="#ffffff" />

      {/* Bottom border */}
      <rect x={70} y={H - 40} width={W - 140} height={1} fill="#E2E8F0" />
      <text x={W / 2} y={H - 18} textAnchor="middle" fill="#CBD5E1" fontSize={11} fontFamily={font} letterSpacing="2">
        {data.address || "Your Address Here"}
      </text>
    </svg>
  );
}
