"use client";

import { CardData } from "@/types/card";
import QRCodeBlock from "./QRCodeBlock";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

const W = 1050;
const H = 600;

export default function SplitPanel({ data, side = "front", scale = 1 }: Props) {
  const red = data.primaryColor || "#E63929";
  const navy = data.secondaryColor || "#2D3650";
  const font = `"${data.fontFamily}", sans-serif`;
  const nScale = (data.fontSizeName ?? 100) / 100;
  const tScale = (data.fontSizeTitle ?? 100) / 100;
  const dScale = (data.fontSizeDetails ?? 100) / 100;
  const frontLogo = data.logoUrlFront ?? data.logoUrl;
  const backLogo = data.logoUrlBack ?? data.logoUrl;
  const fls = (data.logoSizeFront ?? 100) / 100;
  const bls = (data.logoSizeBack ?? 100) / 100;

  // --- BACK SIDE ---
  if (side === "back") {
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W * scale}
        height={H * scale}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Full white background */}
        <rect width={W} height={H} fill="#FFFFFF" />

        {/* Logo or company name centered */}
        {backLogo ? (
          <>
            <defs>
              <clipPath id="sp-logo-back">
                <rect x={W / 2 - 200} y={H / 2 - 110} width={400} height={220} rx={10} />
              </clipPath>
            </defs>
            <image
              href={backLogo}
              x={W/2 - 200*bls}
              y={H/2 - 110*bls}
              width={400*bls}
              height={220*bls}
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#sp-logo-back)"
            />
          </>
        ) : (
          <text
            x={W / 2}
            y={H / 2 + 20}
            textAnchor="middle"
            fill={navy}
            fontSize={80}
            fontWeight="900"
            fontFamily={font}
          >
            {data.company || "Company"}
          </text>
        )}

        {/* Tagline / subtitle */}
        <text
          x={W / 2}
          y={backLogo ? H / 2 + 80 : H / 2 + 70}
          textAnchor="middle"
          fill="#555555"
          fontSize={20}
          fontFamily={font}
        >
          {data.website || data.company || ""}
        </text>
      </svg>
    );
  }

  // --- FRONT SIDE ---
  // Right panel center x for QR
  const rightPanelLeft = 592;
  const rightPanelWidth = W - rightPanelLeft;
  const rightPanelCenterX = rightPanelLeft + rightPanelWidth / 2;
  const qrSize = 180;
  const qrX = Math.round(rightPanelCenterX - qrSize / 2);
  const qrY = 195;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * scale}
      height={H * scale}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left white panel */}
      <rect x={0} y={0} width={575} height={H} fill="#FFFFFF" />

      {/* Red accent strip */}
      <rect x={575} y={0} width={17} height={H} fill={red} />

      {/* Right dark panel */}
      <rect x={592} y={0} width={W - 592} height={H} fill={navy} />

      {/* ── LEFT PANEL CONTENT ── */}

      {/* Full Name */}
      <text
        x={52}
        y={92}
        fill={red}
        fontSize={50 * nScale}
        fontWeight="800"
        fontFamily={font}
      >
        {data.fullName || "Full Name"}
      </text>

      {/* Designation */}
      <text
        x={52}
        y={138}
        fill={navy}
        fontSize={23 * tScale}
        fontWeight="500"
        fontFamily={font}
      >
        {data.designation || "Designation"}
      </text>

      {/* Contact info — anchored at bottom with outline icons */}

      {/* Email row */}
      {data.email && (
        <g transform="translate(52, 398)">
          {/* Envelope outline icon */}
          <rect x={0} y={0} width={28} height={20} rx={2} fill="none" stroke={navy} strokeWidth={2} />
          <path d="M 0,0 L 14,11 L 28,0" fill="none" stroke={navy} strokeWidth={2} />
          {/* Email text */}
          <text
            x={36}
            y={15}
            fill={navy}
            fontSize={20 * dScale}
            fontFamily={font}
            fontWeight="400"
          >
            {data.email}
          </text>
        </g>
      )}

      {/* Phone row */}
      {(data.phone || data.mobile) && (
        <g transform="translate(52, 454)">
          {/* Phone outline icon */}
          <path
            d="M18,12 C18,10 16,9 15,9 L13,9 C12,9 11,10 11,11 L11,13 C11,14 12,15 13,15 C14,17 16,19 18,20 L18,19 C18,18 19,17 20,17 L22,17 C23,17 24,18 24,19 C24,20 23,21 22,21 C17,21 11,15 11,10 C11,9 12,8 13,8 L15,8 C16,8 17,9 17,10 Z"
            fill="none"
            stroke={navy}
            strokeWidth={1.8}
          />
          <path
            d="M 5,11 A 7,7 0 0 1 11,5"
            fill="none"
            stroke={navy}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <path
            d="M 2,13 A 11,11 0 0 1 11,3"
            fill="none"
            stroke={navy}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          {/* Phone text */}
          <text
            x={36}
            y={15}
            fill={navy}
            fontSize={20 * dScale}
            fontFamily={font}
            fontWeight="400"
          >
            {data.phone || data.mobile}
          </text>
        </g>
      )}

      {/* Address row */}
      {data.address && (
        <g transform="translate(52, 510)">
          {/* Location pin outline icon */}
          <circle cx={13} cy={10} r={8} fill="none" stroke={navy} strokeWidth={2} />
          <circle cx={13} cy={10} r={3} fill={navy} />
          <path
            d="M 7,16 Q 13,24 19,16"
            fill="none"
            stroke={navy}
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Address text */}
          <text
            x={36}
            y={15}
            fill={navy}
            fontSize={18 * dScale}
            fontFamily={font}
            fontWeight="400"
          >
            {data.address}
          </text>
        </g>
      )}

      {/* ── RIGHT DARK PANEL CONTENT ── */}

      {/* Logo or company name */}
      {frontLogo ? (
        <>
          <defs>
            <clipPath id="sp-logo-front">
              <rect x={608} y={28} width={420} height={110} rx={6} />
            </clipPath>
          </defs>
          <image
            href={frontLogo}
            x={818 - 210*fls}
            y={83 - 55*fls}
            width={420*fls}
            height={110*fls}
            preserveAspectRatio="xMidYMid meet"
            clipPath="url(#sp-logo-front)"
          />
        </>
      ) : (
        <text
          x={rightPanelCenterX}
          y={95}
          textAnchor="middle"
          fill="white"
          fontSize={40}
          fontWeight="900"
          fontFamily={font}
        >
          {data.company || "Company"}
        </text>
      )}

      {/* Tagline / website below logo */}
      <text
        x={616}
        y={frontLogo ? 152 : 160}
        fill="white"
        opacity="0.75"
        fontSize={15}
        fontFamily={font}
      >
        {data.website || ""}
      </text>

      {/* QR Code — centered in right panel */}
      {data.showQR && (
        <QRCodeBlock
          data={data}
          x={qrX}
          y={qrY}
          size={qrSize}
          darkColor="#FFFFFF"
          lightColor={navy}
        />
      )}

      {/* Website — bottom right */}
      {data.website && (
        <text
          x={1030}
          y={572}
          textAnchor="end"
          fill="white"
          opacity="0.9"
          fontSize={18}
          fontWeight="600"
          fontFamily={font}
        >
          {data.website}
        </text>
      )}
    </svg>
  );
}
