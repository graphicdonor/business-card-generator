"use client";

import { CardData } from "@/types/card";
import QRCodeBlock from "./QRCodeBlock";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function MedicalClean({ data, side = "front", scale = 1 }: Props) {
  const W = 1050;
  const H = 600;
  const blue = data.primaryColor || "#0077CC";
  const teal = data.accentColor || "#00A9A5";
  const lightBg = data.secondaryColor || "#E8F4FD";
  const font = data.fontFamily || "Roboto";
  const nScale = (data.fontSizeName ?? 100) / 100;
  const tScale = (data.fontSizeTitle ?? 100) / 100;
  const dScale = (data.fontSizeDetails ?? 100) / 100;
  const frontLogo = data.logoUrlFront ?? data.logoUrl;
  const backLogo = data.logoUrlBack ?? data.logoUrl;

  if (side === "back") {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
        <rect width={W} height={H} fill="white" />
        <rect x={0} y={0} width={W} height={120} fill={blue} />
        <rect x={0} y={H - 80} width={W} height={80} fill={blue} opacity={0.1} />

        {/* Cross symbol */}
        <rect x={W / 2 - 8} y={H / 2 - 50} width={16} height={100} fill={blue} rx={4} />
        <rect x={W / 2 - 50} y={H / 2 - 8} width={100} height={16} fill={blue} rx={4} />

        <text x={W / 2} y={H / 2 + 80} textAnchor="middle" fill={blue} fontSize={18} fontFamily={font} fontWeight="700">
          {data.company || "Medical Center"}
        </text>
        <text x={W / 2} y={H / 2 + 110} textAnchor="middle" fill="#64748B" fontSize={13} fontFamily={font}>
          {data.website || "www.medical.com"}
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
      <rect width={W} height={H} fill="white" />

      {/* Top medical blue bar */}
      <rect x={0} y={0} width={W} height={130} fill={blue} />

      {/* Teal accent */}
      <rect x={0} y={128} width={W} height={4} fill={teal} />

      {/* Cross in top bar */}
      <rect x={80} y={25} width={14} height={80} fill="white" rx={3} opacity={0.9} />
      <rect x={50} y={52} width={74} height={26} fill="white" rx={3} opacity={0.9} />

      {/* Company in header */}
      <text x={160} y={65} fill="white" fontSize={26 * tScale} fontFamily={font} fontWeight="700">
        {data.company || "Medical Center"}
      </text>
      <text x={160} y={95} fill={lightBg} fontSize={14} fontFamily={font} opacity={0.9}>
        Quality Healthcare You Can Trust
      </text>

      {/* Dr. badge */}
      <rect x={60} y={160} width={120} height={36} rx={18} fill={blue} opacity={0.1} />
      <text x={120} y={183} textAnchor="middle" fill={blue} fontSize={14} fontFamily={font} fontWeight="600">
        DR. / PROF.
      </text>

      {/* Name */}
      <text x={60} y={255} fill="#0F172A" fontSize={44 * nScale} fontFamily={font} fontWeight="700">
        {data.fullName || "Full Name"}
      </text>

      {/* Designation / specialty */}
      <text x={60} y={295} fill={blue} fontSize={18 * tScale} fontFamily={font} fontWeight="500">
        {data.designation || "General Physician"}
      </text>

      {/* Teal divider */}
      <rect x={60} y={315} width={200} height={2} fill={teal} rx={1} />

      {/* Contact */}
      <g transform="translate(60, 340)">
        <rect x={0} y={0} width={22} height={22} rx={11} fill={blue} />
        {/* Phone SVG icon */}
        <path
          d="M8,5 L10,5 C10.5,5 11,5.5 11,6 L11,7.5 C11,8 10.5,8.5 10,8.5 L9.5,8.8 C10.1,9.7 11,10.5 12,11 L12.3,10.5 C12.8,10 13.3,10 13.8,10.5 L15,11.8 C15.5,12.3 15.5,12.8 15,13.3 L14.2,14.1 C13.7,14.6 13.2,14.6 12.7,14.1 C9.8,12 6,8.2 6,5.8 C6,5.3 6.7,4.8 7.3,4.8 Z"
          fill="white"
          transform="translate(-5, -4)"
        />
        <text x={32} y={16} fill="#374151" fontSize={15 * dScale} fontFamily={font}>
          {data.phone || data.mobile || "+1 (555) 000-0000"}
        </text>
      </g>

      <g transform="translate(60, 378)">
        <rect x={0} y={0} width={22} height={22} rx={11} fill={blue} />
        {/* Envelope SVG icon */}
        <g transform="translate(4, 7)">
          <rect x={0} y={0} width={14} height={10} rx={1.5} fill="none" stroke="white" strokeWidth={1.3} />
          <path d="M0,0.5 L7,6 L14,0.5" fill="none" stroke="white" strokeWidth={1.3} strokeLinejoin="round" />
        </g>
        <text x={32} y={16} fill="#374151" fontSize={15 * dScale} fontFamily={font}>
          {data.email || "doctor@medical.com"}
        </text>
      </g>

      {data.address && (
        <g transform="translate(60, 416)">
          <rect x={0} y={0} width={22} height={22} rx={11} fill={blue} />
          {/* Pin SVG icon */}
          <g transform="translate(7, 3)">
            <path d="M4,0 C2,0 0.5,1.5 0.5,3.5 C0.5,6.5 4,11 4,11 C4,11 7.5,6.5 7.5,3.5 C7.5,1.5 6,0 4,0 Z" fill="none" stroke="white" strokeWidth={1.3} />
            <circle cx={4} cy={3.5} r={1.4} fill="white" />
          </g>
          <text x={32} y={16} fill="#374151" fontSize={14 * dScale} fontFamily={font}>
            {data.address.length > 55 ? data.address.substring(0, 55) + "..." : data.address}
          </text>
        </g>
      )}

      {/* QR code - lower right */}
      <QRCodeBlock data={data} x={W - 185} y={350} size={110} darkColor={blue} lightColor="#ffffff" />

      {/* Right decorative element */}
      <circle cx={W - 120} cy={H / 2 + 60} r={160} fill={blue} opacity={0.04} />
      <circle cx={W - 120} cy={H / 2 + 60} r={100} fill={teal} opacity={0.06} />

      {/* Bottom bar */}
      <rect x={0} y={H - 45} width={W} height={45} fill={lightBg} />
      <text x={W / 2} y={H - 18} textAnchor="middle" fill={blue} fontSize={12} fontFamily={font}>
        {data.website || "www.medical.com"}  |  {data.address || "Your Address"}
      </text>
    </svg>
  );
}
