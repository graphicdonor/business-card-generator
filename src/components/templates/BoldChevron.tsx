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

function scaleFontSize(text: string, max: number, min = 30) {
  const len = text.length;
  if (len <= 12) return max;
  if (len <= 18) return Math.round(max * 0.85);
  if (len <= 24) return Math.round(max * 0.72);
  return min;
}

export default function BoldChevron({ data, side = "front", scale = 1 }: Props) {
  const bg = "#F7F3EE";
  const navy = data.secondaryColor || "#1B2B5E";
  const red = data.primaryColor || "#E5362A";
  const font = `"${data.fontFamily}", sans-serif`;
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
        <rect width={W} height={H} fill={bg} />

        {/* Ghost chevron - top right */}
        <path d={`M 880,0 L 1050,0 L 1050,${H} L 880,${H} L 962,${H / 2} Z`} fill={red} opacity="0.1" />

        {/* Logo or company name — centered */}
        {backLogo ? (
          <>
            <defs>
              <clipPath id="bc-logo-back">
                <rect x={W / 2 - 140} y={H / 2 - 95} width={280} height={190} rx={10} />
              </clipPath>
            </defs>
            <image
              href={backLogo}
              x={W/2 - 140*bls}
              y={H/2 - 95*bls}
              width={280*bls}
              height={190*bls}
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#bc-logo-back)"
            />
          </>
        ) : (
          <text
            x={W / 2}
            y={H / 2 + 30}
            textAnchor="middle"
            fill={navy}
            fontSize={scaleFontSize(data.company || "Company", 88, 50) * tScale}
            fontWeight="800"
            fontFamily={font}
            letterSpacing="-2"
          >
            {data.company || "Company"}
          </text>
        )}

        {/* Accent line */}
        <line x1={W / 2 - 70} y1={H / 2 + 62} x2={W / 2 + 70} y2={H / 2 + 62} stroke={red} strokeWidth={3} />

        {/* Address — bottom left */}
        {data.address && (() => {
          const parts = data.address.split(",");
          const line1 = parts.slice(0, 2).join(",").trim();
          const line2 = parts.slice(2).join(",").trim();
          return (
            <g>
              {/* Pin icon */}
              <circle cx={52} cy={H - 90} r={13} fill={red} />
              <circle cx={52} cy={H - 94} r={5} fill="white" />
              <polygon points={`46,${H - 82} 58,${H - 82} 52,${H - 70}`} fill={red} />
              <text x={74} y={H - 87} fill={navy} fontSize={16 * dScale} fontFamily={font} fontWeight="500">
                {line1}
              </text>
              {line2 && (
                <text x={74} y={H - 65} fill={navy} fontSize={16 * dScale} fontFamily={font} fontWeight="500">
                  {line2}
                </text>
              )}
            </g>
          );
        })()}

        {/* Website — bottom right */}
        {data.website && (
          <g>
            {/* Globe icon */}
            <circle cx={W - 290} cy={H - 78} r={13} fill="none" stroke={red} strokeWidth={2} />
            <ellipse cx={W - 290} cy={H - 78} rx={6.5} ry={13} fill="none" stroke={red} strokeWidth={1.5} />
            <line x1={W - 303} y1={H - 78} x2={W - 277} y2={H - 78} stroke={red} strokeWidth={1.5} />
            <text x={W - 270} y={H - 72} fill={navy} fontSize={16 * dScale} fontFamily={font} fontWeight="500">
              {data.website}
            </text>
          </g>
        )}
      </svg>
    );
  }

  // --- FRONT ---
  const hasLogo = !!frontLogo;
  const hasQR = data.showQR;
  const qrSize = hasLogo ? 100 : 120;

  // Phone + email anchored from bottom — clear gap above watermark (H-22)
  const emailY = H - 112;
  const phoneY = emailY - 68;

  // Name/designation anchored from top
  const nameY = hasLogo ? 148 : 100;
  const desigY = nameY + 40;
  const divY = desigY + 20;

  // QR fills space between divider and phone
  const qrY = divY + 14;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
      <rect width={W} height={H} fill={bg} />

      {/* Large red chevron — right side */}
      <path d={`M 510,0 L 1050,0 L 1050,${H} L 510,${H} L 700,${H / 2} Z`} fill={red} />

      {/* Logo — top left */}
      {frontLogo ? (
        <>
          <defs>
            <clipPath id="bc-logo-front">
              <rect x={55} y={36} width={80} height={80} rx={8} />
            </clipPath>
          </defs>
          <image
            href={frontLogo}
            x={95 - 40*fls}
            y={76 - 40*fls}
            width={80*fls}
            height={80*fls}
            preserveAspectRatio="xMidYMid meet"
            clipPath="url(#bc-logo-front)"
          />
        </>
      ) : null}

      {/* Full Name */}
      <text
        x={60}
        y={nameY}
        fill={navy}
        fontSize={scaleFontSize(data.fullName || "Full Name", 52) * nScale}
        fontWeight="800"
        fontFamily={font}
      >
        {data.fullName || "Full Name"}
      </text>

      {/* Designation */}
      <text
        x={60}
        y={desigY}
        fill={navy}
        fontSize={24 * tScale}
        fontWeight="400"
        fontFamily={font}
        opacity="0.72"
      >
        {data.designation || "Designation"}
      </text>

      {/* Divider */}
      <line x1={60} y1={divY + 6} x2={350} y2={divY + 6} stroke={red} strokeWidth={2.5} opacity="0.35" />

      {/* QR Code */}
      <QRCodeBlock data={data} x={60} y={qrY} size={qrSize} darkColor={navy} lightColor={bg} />

      {/* Phone */}
      {(data.phone || data.mobile) && (
        <g transform={`translate(60, ${phoneY})`}>
          {/* Circle */}
          <circle cx={16} cy={16} r={16} fill={red} />
          {/* Phone icon: smartphone silhouette */}
          <rect x={10} y={7} width={12} height={18} rx={3} fill="none" stroke="white" strokeWidth={1.5} />
          <circle cx={16} cy={22} r={1.5} fill="white" />
          {/* Text */}
          <text x={44} y={22} fill={navy} fontSize={24 * dScale} fontFamily={font} fontWeight="600">
            {data.phone || data.mobile}
          </text>
        </g>
      )}

      {/* Email */}
      {data.email && (
        <g transform={`translate(60, ${emailY})`}>
          {/* Circle */}
          <circle cx={16} cy={16} r={16} fill={red} />
          {/* Envelope icon */}
          <rect x={6} y={9} width={20} height={14} rx={2} fill="none" stroke="white" strokeWidth={1.5} />
          <path d="M 6,9 L 16,17 L 26,9" fill="none" stroke="white" strokeWidth={1.5} strokeLinejoin="round" />
          {/* Text */}
          <text x={44} y={22} fill={navy} fontSize={22 * dScale} fontFamily={font} fontWeight="600">
            {data.email}
          </text>
        </g>
      )}

      {/* Company watermark — bottom */}
      {data.company && (
        <text
          x={60}
          y={H - 18}
          fill={navy}
          fontSize={13}
          fontFamily={font}
          opacity="0.28"
          fontWeight="700"
          letterSpacing="5"
        >
          {data.company.toUpperCase()}
        </text>
      )}
    </svg>
  );
}
