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
  const nScale = (data.fontSizeName        ?? 100) / 100;
  const tScale = (data.fontSizeTitle       ?? 100) / 100;
  const eScale = (data.fontSizeEmail       ?? 100) / 100;
  const pScale = (data.fontSizePhone       ?? 100) / 100;
  const aScale = (data.fontSizeAddress     ?? 100) / 100;
  const cScale = (data.fontSizeCompany     ?? 100) / 100;
  const wScale = (data.fontSizeWebsite     ?? 100) / 100;
  const sScale = (data.fontSizeSlogan      ?? 100) / 100;

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
            fontSize={72 * cScale}
            fontWeight="900"
            fontFamily={font}
            letterSpacing="-1"
          >
            {data.company || "Company"}
          </text>
        )}

        {/* Tagline / slogan on back */}
        {data.slogan && (
          <text
            x={W / 2}
            y={backLogo ? bY + bHt + 38 : H / 2 + 55}
            textAnchor="middle"
            fill={red}
            fontSize={13 * sScale}
            fontWeight="600"
            fontFamily={font}
            letterSpacing="2.5"
          >
            {data.slogan}
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


        {/* ── Email – viewBox 8.51×5.81 → scale 2.75 = 16px tall, 23px wide ── */}
        {hasEmail && (
          <g transform={`translate(60, ${emailY})`}>
            <g transform="translate(0, 1) scale(2.75)">
              <path
                d="M.68,0A.687.687,0,0,0,0,.68V5.13a.687.687,0,0,0,.68.68H7.83a.687.687,0,0,0,.68-.68V.68A.687.687,0,0,0,7.83,0Zm.35.58H7.48L4.35,3.45s-.16.04-.2,0L1.03.58M.58.96l2.1,1.93L.58,4.84Zm7.34,0V4.84L5.82,2.89ZM3.11,3.28l.65.6a.713.713,0,0,0,.98,0l.65-.6L7.48,5.22H1.01L3.1,3.28Z"
                fill={navy}
              />
            </g>
            <text x={30} y={14} fill={navy} fontSize={18 * eScale} fontFamily={font}>
              {data.email}
            </text>
          </g>
        )}

        {/* ── Phone – viewBox 12×12 → scale 1.5 = 18px tall, 18px wide ── */}
        {hasPhone && (
          <g transform={`translate(60, ${phoneY})`}>
            <g transform="scale(1.5)">
              <path
                d="M5.65637 9.63C4.3893 8.76121 3.29669 7.66215 2.43537 6.39C2.09955 5.89271 1.95047 5.29266 2.01453 4.69603C2.07858 4.0994 2.35164 3.54467 2.78537 3.13C2.95403 2.96207 3.18235 2.86779 3.42037 2.86779C3.65838 2.86779 3.8867 2.96207 4.05537 3.13L4.85537 3.92C5.02151 4.08372 5.1176 4.30555 5.12338 4.53874C5.12916 4.77192 5.04419 4.99824 4.88637 5.17L4.53637 5.55C4.49122 5.59733 4.46278 5.65812 4.45538 5.72311C4.44798 5.7881 4.46202 5.85373 4.49537 5.91C4.87777 6.57888 5.43412 7.13177 6.10537 7.51C6.16254 7.54595 6.23017 7.56157 6.29732 7.55431C6.36446 7.54705 6.4272 7.51734 6.47537 7.47L6.86637 7.12C7.03794 6.96234 7.26398 6.87738 7.49692 6.88297C7.72986 6.88857 7.95156 6.98429 8.11537 7.15V7.16L8.90537 7.95C8.98969 8.03652 9.05609 8.13885 9.10075 8.25111C9.14541 8.36337 9.16744 8.48335 9.16558 8.60416C9.16372 8.72496 9.13801 8.84421 9.08992 8.95504C9.04183 9.06588 8.97232 9.16612 8.88537 9.25C8.38763 9.7524 7.71155 10.0378 7.00437 10.044C6.52359 10.0449 6.05375 9.9006 5.65637 9.63ZM3.18637 3.52C2.85016 3.83966 2.63769 4.26782 2.58646 4.7289C2.53523 5.18998 2.64853 5.65433 2.90637 6.04C3.73083 7.25628 4.77545 8.30768 5.98637 9.14C6.37386 9.38786 6.83579 9.49253 7.29228 9.43593C7.74877 9.37932 8.17114 9.165 8.48637 8.83L8.46537 8.82C8.49973 8.78972 8.52762 8.7528 8.54737 8.71147C8.56711 8.67013 8.5783 8.62524 8.58026 8.57947C8.58222 8.53371 8.57492 8.48802 8.55878 8.44515C8.54265 8.40228 8.51801 8.36311 8.48637 8.33L7.69737 7.54C7.63589 7.48099 7.5545 7.44722 7.46931 7.44537C7.38412 7.44352 7.30135 7.47372 7.23737 7.53L6.84637 7.88C6.70533 8.00691 6.52724 8.08514 6.33837 8.10314C6.1495 8.12115 5.95984 8.07798 5.79737 7.98C5.05054 7.55181 4.42971 6.93443 3.99737 6.19C3.90086 6.02645 3.85946 5.83621 3.87926 5.64735C3.89907 5.45848 3.97903 5.28098 4.10737 5.141L4.45737 4.761C4.48629 4.73081 4.50898 4.69522 4.52413 4.65626C4.53929 4.61729 4.54661 4.57572 4.54568 4.53393C4.54475 4.49213 4.53559 4.45093 4.51872 4.41267C4.50185 4.37442 4.4776 4.33987 4.44737 4.311L3.64737 3.521C3.58341 3.46272 3.49989 3.43059 3.41337 3.431C3.37153 3.43012 3.32993 3.43753 3.29097 3.4528C3.25201 3.46808 3.21646 3.49092 3.18637 3.52ZM9.46537 5.74C9.46537 4.90192 9.13244 4.09816 8.53982 3.50554C7.94721 2.91293 7.14345 2.58 6.30537 2.58C6.22845 2.58 6.15469 2.54945 6.1003 2.49506C6.04592 2.44068 6.01537 2.36691 6.01537 2.29C6.01537 2.21309 6.04592 2.13932 6.1003 2.08494C6.15469 2.03055 6.22845 2 6.30537 2L6.31537 2.01C7.30471 2.01 8.25356 2.40295 8.95323 3.10243C9.6529 3.80191 10.0461 4.75065 10.0464 5.74C10.0464 5.81705 10.0158 5.89094 9.96128 5.94541C9.9068 5.99989 9.83291 6.0305 9.75587 6.0305C9.67882 6.0305 9.60493 5.99989 9.55045 5.94541C9.49597 5.89094 9.46537 5.81705 9.46537 5.74ZM8.31637 5.73C8.31637 5.46596 8.26434 5.2045 8.16327 4.96058C8.06219 4.71665 7.91405 4.49502 7.7273 4.30836C7.54055 4.1217 7.31885 3.97367 7.07487 3.87271C6.83089 3.77176 6.56941 3.71987 6.30537 3.72L6.31537 3.73C6.23845 3.73 6.16469 3.69945 6.1103 3.64506C6.05592 3.59068 6.02537 3.51691 6.02537 3.44C6.02537 3.36309 6.05592 3.28932 6.1103 3.23494C6.16469 3.18055 6.23845 3.15 6.31537 3.15C6.65438 3.14961 6.99015 3.21606 7.30346 3.34555C7.61677 3.47504 7.90147 3.66504 8.14129 3.90466C8.3811 4.14429 8.57132 4.42885 8.70105 4.74206C8.83079 5.05527 8.8975 5.39098 8.89737 5.73C8.89737 5.80691 8.86681 5.88068 8.81243 5.93506C8.75804 5.98945 8.68428 6.02 8.60737 6.02C8.53045 6.02 8.45669 5.98945 8.4023 5.93506C8.34792 5.88068 8.31737 5.80691 8.31737 5.73H8.31637ZM7.16637 5.73C7.16637 5.50191 7.07576 5.28317 6.91448 5.12189C6.7532 4.96061 6.53445 4.87 6.30637 4.87L6.31637 4.88C6.23932 4.88 6.16543 4.84939 6.11095 4.79491C6.05647 4.74044 6.02587 4.66655 6.02587 4.5895C6.02587 4.51245 6.05647 4.43856 6.11095 4.38409C6.16543 4.32961 6.23932 4.299 6.31637 4.299C6.69562 4.299 7.05935 4.44966 7.32753 4.71784C7.59571 4.98601 7.74637 5.34974 7.74637 5.729C7.74637 5.80591 7.71581 5.87968 7.66143 5.93406C7.60704 5.98845 7.53328 6.019 7.45637 6.019C7.37945 6.019 7.30569 5.98845 7.2513 5.93406C7.19692 5.87968 7.16637 5.80691 7.16637 5.73Z"
                fill={navy}
              />
            </g>
            <text x={30} y={14} fill={navy} fontSize={18 * pScale} fontFamily={font}>
              {data.phone || data.mobile}
            </text>
          </g>
        )}

        {/* ── Address – viewBox 6.1×9.06 → scale 2.0 = 18px tall, 12px wide ── */}
        {hasAddress && (
          <g transform={`translate(60, ${addrTopY - 20})`}>
            <g transform="scale(2.0)">
              <path
                d="M4.25,25.89a3.039,3.039,0,0,1,3.04,3.04c0,1.23-.96,2.48-1.89,3.68-.14.18-.27.35-.44.58a1.047,1.047,0,0,1-.32.27.893.893,0,0,1-1.12-.27c-.17-.23-.31-.4-.44-.58-.92-1.2-1.89-2.45-1.89-3.68a3.039,3.039,0,0,1,3.04-3.04Zm1.72,7a.276.276,0,0,1,.29-.47,1.633,1.633,0,0,1,.49.44,1.029,1.029,0,0,1,.19.58,1.344,1.344,0,0,1-.86,1.12,4.208,4.208,0,0,1-1.84.39,4.208,4.208,0,0,1-1.84-.39,1.344,1.344,0,0,1-.86-1.12,1.029,1.029,0,0,1,.19-.58,1.5,1.5,0,0,1,.49-.44.276.276,0,0,1,.29.47,1.2,1.2,0,0,0-.33.29.432.432,0,0,0-.09.26c0,.23.21.45.56.62a3.644,3.644,0,0,0,1.59.33,3.676,3.676,0,0,0,1.59-.33c.34-.18.56-.4.56-.62a.454.454,0,0,0-.09-.26A1.2,1.2,0,0,0,5.97,32.89ZM4.25,27.44a1.5,1.5,0,1,1-1.05.44,1.482,1.482,0,0,1,1.05-.44m.66.83a.942.942,0,1,0,.27.66.921.921,0,0,0-.27-.66m1.1-1.1a2.49,2.49,0,0,0-4.25,1.76c0,1.04.9,2.22,1.77,3.35.16.21.33.43.45.59a.294.294,0,0,0,.12.1.39.39,0,0,0,.3,0,.53.53,0,0,0,.12-.1c.12-.16.28-.37.45-.59.87-1.13,1.77-2.3,1.77-3.35A2.478,2.478,0,0,0,6.01,27.17Z"
                transform="translate(-1.19 -25.89)"
                fill={navy}
              />
            </g>
            {addressLines.map((line, i) => (
              <text
                key={i}
                x={30}
                y={i * LINE_H + 20}
                fill={navy}
                fontSize={17 * aScale}
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
            fontSize={32 * cScale}
            fontWeight="800"
            fontFamily={font}
            letterSpacing="3"
          >
            {(data.company || "Company").toUpperCase()}
          </text>
        )}

        {/* Slogan – right panel tagline, independent from website URL */}
        {data.slogan && (
          <text
            x={RIGHT_CX}
            y={158}
            textAnchor="middle"
            fill="white"
            opacity="0.65"
            fontSize={13 * sScale}
            fontFamily={font}
          >
            {data.slogan}
          </text>
        )}


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
