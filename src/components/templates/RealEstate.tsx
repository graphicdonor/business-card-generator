"use client";

import { CardData } from "@/types/card";
import QRCodeBlock from "./QRCodeBlock";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function RealEstate({ data, side = "front", scale = 1 }: Props) {
  const W = 1050;
  const H = 600;
  const brown = data.primaryColor || "#92400E";
  const amber = data.accentColor || "#D97706";
  const cream = data.secondaryColor || "#FFFBEB";
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
        <rect width={W} height={H} fill={cream} />
        <rect x={0} y={0} width={W} height={10} fill={brown} />
        <rect x={0} y={H - 10} width={W} height={10} fill={brown} />

        {/* House icon */}
        <polygon points={`${W / 2 - 80},${H / 2 - 20} ${W / 2},${H / 2 - 100} ${W / 2 + 80},${H / 2 - 20}`} fill={amber} />
        <rect x={W / 2 - 65} y={H / 2 - 20} width={130} height={100} fill={brown} />
        <rect x={W / 2 - 25} y={H / 2 + 20} width={50} height={60} fill={cream} />

        <text x={W / 2} y={H / 2 + 130} textAnchor="middle" fill={brown} fontSize={22} fontFamily={font} fontWeight="700">
          {data.company || "Real Estate"}
        </text>
        <text x={W / 2} y={H / 2 + 160} textAnchor="middle" fill={amber} fontSize={14} fontFamily={font}>
          {data.website || "www.realestate.com"}
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W * scale} height={H * scale} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="reLogoClip">
          <circle cx={90} cy={80} r={47} />
        </clipPath>
      </defs>
      <rect width={W} height={H} fill={cream} />

      {/* Brown header */}
      <rect x={0} y={0} width={W} height={160} fill={brown} />

      {/* Amber stripe */}
      <rect x={0} y={157} width={W} height={6} fill={amber} />

      {/* Right angled decoration */}
      <polygon points={`700,0 ${W},0 ${W},160`} fill={amber} opacity={0.3} />

      {/* Logo in header */}
      <circle cx={90} cy={80} r={50} fill="white" opacity={0.15} />
      {frontLogo ? (
        <image href={frontLogo} x={90 - 47*fls} y={80 - 47*fls} width={94*fls} height={94*fls} clipPath="url(#reLogoClip)" preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text x={90} y={80} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={30} fontFamily={font} fontWeight="800">
          {data.logoText || data.company?.substring(0, 2).toUpperCase() || "RE"}
        </text>
      )}

      <text x={165} y={65} fill="white" fontSize={26 * tScale} fontFamily={font} fontWeight="700">
        {data.company || "Real Estate Co."}
      </text>
      <text x={165} y={100} fill={amber} fontSize={13} fontFamily={font} letterSpacing="2">
        YOUR TRUSTED AGENT
      </text>
      <text x={165} y={128} fill="white" fontSize={12} fontFamily={font} opacity={0.7}>
        {data.website || "www.realestate.com"}
      </text>

      {/* Name */}
      <text x={60} y={240} fill={brown} fontSize={46 * nScale} fontFamily={font} fontWeight="700">
        {data.fullName || "Full Name"}
      </text>

      {/* Designation */}
      <text x={62} y={280} fill={amber} fontSize={17 * tScale} fontFamily={font} fontWeight="600" letterSpacing="1">
        {data.designation || "Real Estate Agent"}
      </text>

      {/* Divider */}
      <rect x={60} y={300} width={180} height={2} fill={brown} opacity={0.3} rx={1} />

      {/* Contact */}
      {/* Phone */}
      <g transform="translate(60, 320)">
        <circle cx={9} cy={9} r={12} fill={brown} opacity={0.12} />
        <path d="M5,2.5 L7,2.5 C7.5,2.5 8,3 8,3.5 L8,5.5 C8,6 7.5,6.5 7,6.5 L6.5,6.8 C7.2,8 8.3,9 9.5,9.5 L9.8,9 C10.3,8.5 10.8,8.5 11.3,9 L13,10.5 C13.5,11 13.5,11.5 13,12 L12,13 C11.5,13.5 11,13.5 10.5,13 C7.5,10.5 3.5,6.5 3.5,4 C3.5,3.1 4.2,2.5 5,2.5 Z" fill={brown} />
        <text x={24} y={14} fill="#6B3C12" fontFamily={font} fontSize={15 * dScale}>
          {data.phone || data.mobile || "+1 (555) 000-0000"}
        </text>
      </g>
      {/* Email */}
      <g transform="translate(60, 353)">
        <circle cx={9} cy={9} r={12} fill={brown} opacity={0.12} />
        <g transform="translate(2, 4)">
          <rect x={0} y={0} width={14} height={10} rx={1.5} fill="none" stroke={brown} strokeWidth={1.3} />
          <path d="M0,0.5 L7,6.5 L14,0.5" fill="none" stroke={brown} strokeWidth={1.3} strokeLinejoin="round" />
        </g>
        <text x={24} y={14} fill="#6B3C12" fontFamily={font} fontSize={15 * dScale}>
          {data.email || "agent@realestate.com"}
        </text>
      </g>
      {/* Website */}
      <g transform="translate(60, 386)">
        <circle cx={9} cy={9} r={12} fill={brown} opacity={0.12} />
        <g transform="translate(2, 2)">
          <circle cx={7} cy={7} r={6.5} fill="none" stroke={brown} strokeWidth={1.3} />
          <ellipse cx={7} cy={7} rx={3.5} ry={6.5} fill="none" stroke={brown} strokeWidth={1} />
          <line x1={0.5} y1={7} x2={13.5} y2={7} stroke={brown} strokeWidth={1} />
          <path d="M1.5,4.5 Q7,5.8 12.5,4.5" fill="none" stroke={brown} strokeWidth={0.9} />
          <path d="M1.5,9.5 Q7,8.2 12.5,9.5" fill="none" stroke={brown} strokeWidth={0.9} />
        </g>
        <text x={24} y={14} fill="#6B3C12" fontFamily={font} fontSize={15 * dScale}>
          {data.website || "www.realestate.com"}
        </text>
      </g>
      {/* Address */}
      {data.address && (
        <g transform="translate(60, 419)">
          <circle cx={9} cy={9} r={12} fill={brown} opacity={0.12} />
          <g transform="translate(4, 2)">
            <path d="M5,0 C2.5,0 0.5,2 0.5,4.5 C0.5,8 5,14 5,14 C5,14 9.5,8 9.5,4.5 C9.5,2 7.5,0 5,0 Z" fill="none" stroke={brown} strokeWidth={1.3} />
            <circle cx={5} cy={4.5} r={1.8} fill={brown} />
          </g>
          <text x={24} y={14} fill="#6B3C12" fontFamily={font} fontSize={13 * dScale}>
            {data.address.length > 55 ? data.address.substring(0, 55) + "..." : data.address}
          </text>
        </g>
      )}

      {/* QR code - lower right */}
      <QRCodeBlock data={data} x={W - 185} y={385} size={110} darkColor={brown} lightColor={cream} />

      {/* Right decorative house */}
      <g transform={`translate(${W - 250}, 200) scale(0.8)`} opacity={0.08}>
        <polygon points="130,40 250,130 10,130" fill={brown} />
        <rect x={50} y={130} width={200} height={150} fill={brown} />
        <rect x={110} y={170} width={80} height={110} fill={cream} />
      </g>

      {/* Bottom amber bar */}
      <rect x={0} y={H - 30} width={W} height={30} fill={brown} opacity={0.08} />
    </svg>
  );
}
