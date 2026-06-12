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

// Panel proportions scaled from original SVG (252×144):
// Left panel: 0 – 700   (66.7 % of width)
// Red strip:  700 – 708  (0.76% – 8 px)
// Right panel: 708 – 1050 (32.6 % – 342 px)
const SPLIT_X = 700;
const STRIP_W = 8;
const RIGHT_X = 708;
const RIGHT_W = W - RIGHT_X;          // 342
const RIGHT_CX = RIGHT_X + RIGHT_W / 2; // ≈ 879

export default function RDashPro({ data, side = "front", scale = 1 }: Props) {
  const red   = data.primaryColor   || "#E21F26";
  const navy  = data.secondaryColor || "#354054";
  const font  = `"${data.fontFamily || "Inter"}", sans-serif`;
  const nScale = (data.fontSizeName   ?? 100) / 100;
  const tScale = (data.fontSizeTitle  ?? 100) / 100;
  const dScale = (data.fontSizeDetails ?? 100) / 100;

  const frontLogo = data.logoUrlFront ?? data.logoUrl;
  const backLogo  = data.logoUrlBack  ?? data.logoUrl;
  const fls = (data.logoSizeFront ?? 100) / 100;
  const bls = (data.logoSizeBack  ?? 100) / 100;

  // ── BACK ──────────────────────────────────────────────────────────────────
  if (side === "back") {
    const bW = 400 * bls;
    const bHt = 200 * bls;
    const bX = W / 2 - bW / 2;
    const bY = H / 2 - bHt / 2 - 20;

    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W * scale}
        height={H * scale}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* White background */}
        <rect width={W} height={H} fill="#FFFFFF" />

        {/* Thin red top + bottom bars */}
        <rect x={0} y={0}      width={W} height={5} fill={red} />
        <rect x={0} y={H - 5} width={W} height={5} fill={red} />

        {/* Subtle navy corner accents */}
        <rect x={0}     y={0} width={60} height={5} fill={navy} />
        <rect x={W - 60} y={0} width={60} height={5} fill={navy} />
        <rect x={0}     y={H - 5} width={60} height={5} fill={navy} />
        <rect x={W - 60} y={H - 5} width={60} height={5} fill={navy} />

        {/* Logo or company name */}
        {backLogo ? (
          <>
            <defs>
              <clipPath id="rdpro-back-logo-clip">
                <rect x={bX} y={bY} width={bW} height={bHt} />
              </clipPath>
            </defs>
            <image
              href={backLogo}
              x={bX} y={bY}
              width={bW} height={bHt}
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#rdpro-back-logo-clip)"
            />
          </>
        ) : (
          <text
            x={W / 2}
            y={H / 2 - 15}
            textAnchor="middle"
            fill={navy}
            fontSize={72}
            fontWeight="900"
            fontFamily={font}
            letterSpacing="-1"
          >
            {data.company || "Company"}
          </text>
        )}

        {/* Tagline / website */}
        {data.website && (
          <text
            x={W / 2}
            y={backLogo ? bY + bHt + 38 : H / 2 + 55}
            textAnchor="middle"
            fill={red}
            fontSize={13}
            fontWeight="600"
            fontFamily={font}
            letterSpacing="2.5"
          >
            {data.website.toUpperCase()}
          </text>
        )}
      </svg>
    );
  }

  // ── FRONT ─────────────────────────────────────────────────────────────────

  // Word-wrap address into max-3 lines of ≤33 chars (space + comma aware)
  const addressLines: string[] = (() => {
    if (!data.address) return [];
    const MAX = 33;
    // Split on whitespace; commas stay attached to the preceding word
    const words = data.address.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      if (!cur) { cur = w; continue; }
      if ((cur + " " + w).length > MAX) {
        lines.push(cur);
        if (lines.length >= 2) { lines.push(w); break; }
        cur = w;
      } else {
        cur += " " + w;
      }
    }
    if (cur && lines.length < 3) lines.push(cur);
    return lines.slice(0, 3);
  })();

  const LINE_H = 27; // vertical spacing between address lines

  // Contact rows – bottom-anchored from y = H - 38
  const CONTACT_BOTTOM = H - 38;
  const addrBlockH = addressLines.length > 0 ? addressLines.length * LINE_H : 0;
  const addrTopY   = addressLines.length > 0 ? CONTACT_BOTTOM - addrBlockH + LINE_H : 0;

  const hasAddress = addressLines.length > 0;
  const hasPhone   = !!(data.phone || data.mobile);
  const hasEmail   = !!data.email;

  const phoneY = hasAddress ? addrTopY - 46 : CONTACT_BOTTOM;
  const emailY = hasPhone   ? phoneY - 43  : (hasAddress ? addrTopY - 43 : CONTACT_BOTTOM);

  // Right-panel logo area (scaled from center)
  const logoAreaBaseW = RIGHT_W - 40; // 302
  const logoAreaBaseH = 110;
  const logoCX = RIGHT_CX;
  const logoCY = 25 + logoAreaBaseH / 2; // center-y ≈ 80
  const logoX  = logoCX - (logoAreaBaseW * fls) / 2;
  const logoY  = logoCY - (logoAreaBaseH * fls) / 2;
  const logoW  = logoAreaBaseW * fls;
  const logoHt = logoAreaBaseH * fls;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * scale}
      height={H * scale}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Hard clip: left panel — nothing bleeds past the red strip */}
        <clipPath id="rdpro-left-panel-clip">
          <rect x={0} y={0} width={SPLIT_X} height={H} />
        </clipPath>
        {/* Hard clip: right panel — logo/text stays inside dark area */}
        <clipPath id="rdpro-right-panel-clip">
          <rect x={RIGHT_X} y={0} width={RIGHT_W} height={H} />
        </clipPath>
      </defs>

      {/* ── BACKGROUNDS ── */}
      <rect width={W} height={H} fill="#FFFFFF" />
      <rect x={SPLIT_X} y={0} width={STRIP_W} height={H} fill={red} />
      <rect x={RIGHT_X} y={0} width={RIGHT_W} height={H} fill={navy} />

      {/* ══ LEFT PANEL — clipped so nothing overflows past the red strip ══ */}
      <g clipPath="url(#rdpro-left-panel-clip)">

        {/* Name */}
        <text
          x={60}
          y={90}
          fill={red}
          fontSize={46 * nScale}
          fontWeight="800"
          fontFamily={font}
          letterSpacing="-0.5"
        >
          {data.fullName || "Full Name"}
        </text>

        {/* Designation */}
        <text
          x={60}
          y={132}
          fill={navy}
          fontSize={22 * tScale}
          fontWeight="500"
          fontFamily={font}
        >
          {data.designation || "Designation"}
        </text>

        {/* Thin red separator */}
        <rect x={60} y={152} width={260} height={1.5} fill={red} rx={1} opacity="0.3" />

        {/* ── Email – uses /email.svg path (viewBox 8.51×5.81, scaled ×2.6) ── */}
        {hasEmail && (
          <g transform={`translate(60, ${emailY})`}>
            <g transform="scale(2.6)">
              <path
                d="M.68,0A.687.687,0,0,0,0,.68V5.13a.687.687,0,0,0,.68.68H7.83a.687.687,0,0,0,.68-.68V.68A.687.687,0,0,0,7.83,0Zm.35.58H7.48L4.35,3.45s-.16.04-.2,0L1.03.58M.58.96l2.1,1.93L.58,4.84Zm7.34,0V4.84L5.82,2.89ZM3.11,3.28l.65.6a.713.713,0,0,0,.98,0l.65-.6L7.48,5.22H1.01L3.1,3.28Z"
                fill={navy}
              />
            </g>
            <text x={32} y={13} fill={navy} fontSize={19 * dScale} fontFamily={font}>
              {data.email}
            </text>
          </g>
        )}

        {/* ── Phone – uses /contact.svg path (viewBox 9.153×9.043, scaled ×2.2) ── */}
        {hasPhone && (
          <g transform={`translate(60, ${phoneY})`}>
            <g transform="scale(2.2)">
              <path
                d="M3.659,7.63A12.268,12.268,0,0,1,.438,4.39,2.542,2.542,0,0,1,.788,1.13a.9.9,0,0,1,1.27,0l.8.79a.9.9,0,0,1,.031,1.25l-.35.38a.3.3,0,0,0-.041.36,4.268,4.268,0,0,0,1.61,1.6.3.3,0,0,0,.37-.04l.391-.35a.9.9,0,0,1,1.249.03v.01l.79.79a.917.917,0,0,1-.02,1.3,2.681,2.681,0,0,1-1.881.794A2.387,2.387,0,0,1,3.659,7.63ZM1.189,1.52a1.968,1.968,0,0,0-.28,2.52,11.787,11.787,0,0,0,3.08,3.1,1.973,1.973,0,0,0,2.5-.31l-.021-.01a.34.34,0,0,0,.021-.49L5.7,5.54a.34.34,0,0,0-.46-.01l-.391.35a.885.885,0,0,1-1.049.1A4.9,4.9,0,0,1,2,4.19a.886.886,0,0,1,.11-1.049l.35-.38a.318.318,0,0,0-.01-.45l-.8-.79a.345.345,0,0,0-.234-.09A.317.317,0,0,0,1.189,1.52ZM7.468,3.74A3.16,3.16,0,0,0,4.308.58a.29.29,0,0,1,0-.58l.01.01A3.731,3.731,0,0,1,8.049,3.74a.29.29,0,1,1-.581,0ZM6.319,3.73A2.01,2.01,0,0,0,4.308,1.72l.01.01a.29.29,0,1,1,0-.58A2.579,2.579,0,0,1,6.9,3.73a.29.29,0,1,1-.58,0Zm-1.15,0a.86.86,0,0,0-.86-.86l.01.01a.29.29,0,0,1,0-.581,1.43,1.43,0,0,1,1.43,1.43.29.29,0,1,1-.58,0Z"
                transform="translate(0.604 0.5)"
                fill={navy}
                stroke="none"
              />
            </g>
            <text x={32} y={15} fill={navy} fontSize={19 * dScale} fontFamily={font}>
              {data.phone || data.mobile}
            </text>
          </g>
        )}

        {/* ── Address – uses /address.svg path (viewBox 6.1×9.06, scaled ×2.15) ── */}
        {hasAddress && (
          <g transform={`translate(60, ${addrTopY - 20})`}>
            <g transform="scale(2.15)">
              <path
                d="M4.25,25.89a3.039,3.039,0,0,1,3.04,3.04c0,1.23-.96,2.48-1.89,3.68-.14.18-.27.35-.44.58a1.047,1.047,0,0,1-.32.27.893.893,0,0,1-1.12-.27c-.17-.23-.31-.4-.44-.58-.92-1.2-1.89-2.45-1.89-3.68a3.039,3.039,0,0,1,3.04-3.04Zm1.72,7a.276.276,0,0,1,.29-.47,1.633,1.633,0,0,1,.49.44,1.029,1.029,0,0,1,.19.58,1.344,1.344,0,0,1-.86,1.12,4.208,4.208,0,0,1-1.84.39,4.208,4.208,0,0,1-1.84-.39,1.344,1.344,0,0,1-.86-1.12,1.029,1.029,0,0,1,.19-.58,1.5,1.5,0,0,1,.49-.44.276.276,0,0,1,.29.47,1.2,1.2,0,0,0-.33.29.432.432,0,0,0-.09.26c0,.23.21.45.56.62a3.644,3.644,0,0,0,1.59.33,3.676,3.676,0,0,0,1.59-.33c.34-.18.56-.4.56-.62a.454.454,0,0,0-.09-.26A1.2,1.2,0,0,0,5.97,32.89ZM4.25,27.44a1.5,1.5,0,1,1-1.05.44,1.482,1.482,0,0,1,1.05-.44m.66.83a.942.942,0,1,0,.27.66.921.921,0,0,0-.27-.66m1.1-1.1a2.49,2.49,0,0,0-4.25,1.76c0,1.04.9,2.22,1.77,3.35.16.21.33.43.45.59a.294.294,0,0,0,.12.1.39.39,0,0,0,.3,0,.53.53,0,0,0,.12-.1c.12-.16.28-.37.45-.59.87-1.13,1.77-2.3,1.77-3.35A2.478,2.478,0,0,0,6.01,27.17Z"
                transform="translate(-1.19 -25.89)"
                fill={navy}
              />
            </g>
            {addressLines.map((line, i) => (
              <text
                key={i}
                x={24}
                y={i * LINE_H + 20}
                fill={navy}
                fontSize={17 * dScale}
                fontFamily={font}
              >
                {line}
              </text>
            ))}
          </g>
        )}

      </g>{/* end left-panel clip group */}

      {/* ══ RIGHT DARK PANEL — clipped so content stays inside ══ */}
      <g clipPath="url(#rdpro-right-panel-clip)">

        {/* Logo or company name at top */}
        {frontLogo ? (
          <image
            href={frontLogo}
            x={logoX}
            y={logoY}
            width={logoW}
            height={logoHt}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <text
            x={RIGHT_CX}
            y={90}
            textAnchor="middle"
            fill="white"
            fontSize={32}
            fontWeight="800"
            fontFamily={font}
            letterSpacing="3"
          >
            {(data.company || "Company").toUpperCase()}
          </text>
        )}

        {/* Tagline / slogan – plain text, size follows detail scale */}
        {data.website && (
          <text
            x={RIGHT_CX}
            y={158}
            textAnchor="middle"
            fill="white"
            opacity="0.65"
            fontSize={13 * dScale}
            fontFamily={font}
          >
            {data.website.replace(/^https?:\/\//, "")}
          </text>
        )}

        {/* Thin divider below tagline */}
        <rect x={RIGHT_X + 30} y={168} width={RIGHT_W - 60} height={0.75} fill="white" opacity="0.15" />

        {/* QR code – centered in right panel */}
        <QRCodeBlock
          data={data}
          x={RIGHT_CX - 90}
          y={255}
          size={180}
          darkColor="#FFFFFF"
          lightColor={navy}
        />

        {/* Website text at bottom-right */}
        {data.website && (
          <text
            x={W - 28}
            y={H - 20}
            textAnchor="end"
            fill="white"
            opacity="0.75"
            fontSize={13}
            fontWeight="600"
            fontFamily={font}
          >
            {data.website.replace(/^https?:\/\//, "")}
          </text>
        )}

      </g>{/* end right-panel clip group */}
    </svg>
  );
}
