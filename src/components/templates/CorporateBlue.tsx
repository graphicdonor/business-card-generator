"use client";

import { CardData } from "@/types/card";
import QRCodeBlock from "./QRCodeBlock";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function CorporateBlue({ data, side = "front", scale = 1 }: Props) {
  const W = 1050;
  const H = 600;
  const primary = data.primaryColor || "#2563EB";
  const secondary = data.secondaryColor || "#1E3A8A";
  const accent = data.accentColor || "#60A5FA";
  const font = data.fontFamily || "Inter";
  const nScale = (data.fontSizeName ?? 100) / 100;
  const tScale = (data.fontSizeTitle ?? 100) / 100;
  const dScale = (data.fontSizeDetails ?? 100) / 100;
  const frontLogo = data.logoUrlFront ?? data.logoUrl;
  const backLogo = data.logoUrlBack ?? data.logoUrl;
  const fls = (data.logoSizeFront ?? 100) / 100;
  const bls = (data.logoSizeBack ?? 100) / 100;

  if (side === "back") {
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W * scale}
        height={H * scale}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="corpBackLogoClip">
            <circle cx={W / 2} cy={H / 2 - 20} r={76} />
          </clipPath>
        </defs>
        <rect width={W} height={H} fill={secondary} />
        <rect x={0} y={0} width={W} height={8} fill={accent} />
        <rect x={0} y={H - 8} width={W} height={8} fill={accent} />

        <circle cx={W / 2} cy={H / 2} r={180} fill={primary} opacity={0.3} />
        <circle cx={W / 2} cy={H / 2} r={120} fill={primary} opacity={0.4} />

        {/* Logo circle */}
        <circle cx={W / 2} cy={H / 2 - 20} r={80} fill={primary} />
        {backLogo ? (
          <image href={backLogo} x={W/2 - 76*bls} y={H/2 - 20 - 76*bls} width={152*bls} height={152*bls} clipPath="url(#corpBackLogoClip)" preserveAspectRatio="xMidYMid meet" />
        ) : (
          <text
            x={W / 2}
            y={H / 2 - 20}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize={48}
            fontFamily={font}
            fontWeight="700"
          >
            {data.logoText || data.company?.substring(0, 2).toUpperCase() || "CO"}
          </text>
        )}

        <text
          x={W / 2}
          y={H / 2 + 90}
          textAnchor="middle"
          fill="white"
          fontSize={22}
          fontFamily={font}
          fontWeight="600"
          letterSpacing="3"
        >
          {data.company?.toUpperCase() || "COMPANY NAME"}
        </text>
        <text
          x={W / 2}
          y={H / 2 + 125}
          textAnchor="middle"
          fill={accent}
          fontSize={15}
          fontFamily={font}
          letterSpacing="2"
        >
          {data.website || "www.company.com"}
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * scale}
      height={H * scale}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="corpFrontLogoClip">
          <circle cx={90} cy={100} r={43} />
        </clipPath>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill="white" />

      {/* Top header bar */}
      <rect width={W} height={200} fill={secondary} />
      <rect width={W} height={200} fill={primary} opacity={0.85} />

      {/* Diagonal accent */}
      <polygon
        points={`0,200 300,200 0,320`}
        fill={primary}
        opacity={0.15}
      />

      {/* Header accent line */}
      <rect x={0} y={195} width={W} height={5} fill={accent} />

      {/* Logo circle in header */}
      <circle cx={90} cy={100} r={55} fill="white" opacity={0.15} />
      <circle cx={90} cy={100} r={45} fill="white" opacity={0.2} />
      {frontLogo ? (
        <image href={frontLogo} x={90 - 43*fls} y={100 - 43*fls} width={86*fls} height={86*fls} clipPath="url(#corpFrontLogoClip)" preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text
          x={90}
          y={100}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={30}
          fontFamily={font}
          fontWeight="800"
        >
          {data.logoText || data.company?.substring(0, 2).toUpperCase() || "CO"}
        </text>
      )}

      {/* Company name in header */}
      <text
        x={165}
        y={90}
        fill="white"
        fontSize={22 * tScale}
        fontFamily={font}
        fontWeight="700"
        letterSpacing="1"
      >
        {data.company || "Company Name"}
      </text>
      <text
        x={165}
        y={118}
        fill={accent}
        fontSize={13}
        fontFamily={font}
        letterSpacing="2"
      >
        {data.website || "www.company.com"}
      </text>

      {/* Name */}
      <text
        x={60}
        y={275}
        fill="#0F172A"
        fontSize={38 * nScale}
        fontFamily={font}
        fontWeight="700"
      >
        {data.fullName || "Full Name"}
      </text>

      {/* Designation */}
      <text
        x={62}
        y={315}
        fill={primary}
        fontSize={18 * tScale}
        fontFamily={font}
        fontWeight="500"
      >
        {data.designation || "Designation"}
      </text>

      {/* Divider */}
      <rect x={60} y={338} width={160} height={3} fill={accent} rx={2} />

      {/* Contact icons + info */}
      {/* Phone */}
      <g transform="translate(60, 365)">
        <circle cx={11} cy={11} r={14} fill={primary} opacity={0.1} />
        <path
          d="M6,3 L9,3 L10,7 L8,8.5 C9,10.5 11,12.5 13,13.5 L14.5,11.5 L18,12.5 L18,15.5 C18,16.5 17,17.5 16,17 C10,15 4,9 3,4 C2.5,3 3.5,2 4.5,2 Z"
          fill={primary}
          transform="translate(-3,-3) scale(1.4)"
        />
        <text x={32} y={15} fill="#374151" fontSize={16 * dScale} fontFamily={font}>
          {data.phone || data.mobile || "+1 (555) 000-0000"}
        </text>
      </g>

      {/* Email */}
      <g transform="translate(60, 405)">
        <circle cx={11} cy={11} r={14} fill={primary} opacity={0.1} />
        <rect x={3} y={5} width={16} height={12} rx={2} fill="none" stroke={primary} strokeWidth={2} />
        <polyline points="3,5 11,13 19,5" fill="none" stroke={primary} strokeWidth={2} />
        <text x={32} y={15} fill="#374151" fontSize={16 * dScale} fontFamily={font}>
          {data.email || "email@company.com"}
        </text>
      </g>

      {/* Website */}
      <g transform="translate(60, 445)">
        <circle cx={11} cy={11} r={14} fill={primary} opacity={0.1} />
        <circle cx={11} cy={11} r={8} fill="none" stroke={primary} strokeWidth={2} />
        <line x1={3} y1={11} x2={19} y2={11} stroke={primary} strokeWidth={2} />
        <path d="M11,3 Q15,7 15,11 Q15,15 11,19" fill="none" stroke={primary} strokeWidth={2} />
        <path d="M11,3 Q7,7 7,11 Q7,15 11,19" fill="none" stroke={primary} strokeWidth={2} />
        <text x={32} y={15} fill="#374151" fontSize={16 * dScale} fontFamily={font}>
          {data.website || "www.company.com"}
        </text>
      </g>

      {/* Address */}
      {data.address && (
        <g transform="translate(60, 485)">
          <circle cx={11} cy={11} r={14} fill={primary} opacity={0.1} />
          <path
            d="M11,3 C7.7,3 5,5.7 5,9 C5,13.5 11,19 11,19 C11,19 17,13.5 17,9 C17,5.7 14.3,3 11,3 Z M11,11 C9.9,11 9,10.1 9,9 C9,7.9 9.9,7 11,7 C12.1,7 13,7.9 13,9 C13,10.1 12.1,11 11,11 Z"
            fill={primary}
          />
          <text x={32} y={15} fill="#374151" fontSize={14 * dScale} fontFamily={font}>
            {data.address.length > 45 ? data.address.substring(0, 45) + "..." : data.address}
          </text>
        </g>
      )}

      {/* Right accent bar */}
      <rect x={W - 8} y={200} width={8} height={H - 200} fill={accent} opacity={0.6} />

      {/* Bottom right - QR code */}
      <QRCodeBlock data={data} x={W - 140} y={365} size={110} darkColor={secondary} lightColor="#ffffff" />
    </svg>
  );
}
