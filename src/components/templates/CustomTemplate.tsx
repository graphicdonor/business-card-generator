"use client";

import { CardData } from "@/types/card";

interface Props {
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function CustomTemplate({ data, side = "front", scale = 1 }: Props) {
  const W = 1050;
  const H = 600;

  const image = side === "front" ? data.customFrontImage : data.customBackImage;
  const label = side === "front" ? "Front Side" : "Back Side";

  if (image) {
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W * scale}
        height={H * scale}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={W} height={H} fill="#F8FAFC" />
        <image
          href={image}
          x={0}
          y={0}
          width={W}
          height={H}
          preserveAspectRatio="xMidYMid meet"
        />
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
        <linearGradient id={`customBg_${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#F0F9FF" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#customBg_${side})`} />

      {/* Dashed border */}
      <rect
        x={16}
        y={16}
        width={W - 32}
        height={H - 32}
        rx={12}
        fill="none"
        stroke="#BFDBFE"
        strokeWidth={3}
        strokeDasharray="16,10"
      />

      {/* Center upload icon box */}
      <rect x={W / 2 - 52} y={H / 2 - 100} width={104} height={104} rx={20} fill="white" />
      <rect x={W / 2 - 52} y={H / 2 - 100} width={104} height={104} rx={20} fill="none" stroke="#BFDBFE" strokeWidth={2} />

      {/* Upload arrow */}
      <path
        d={`M${W / 2},${H / 2 - 72} L${W / 2 - 20},${H / 2 - 52} L${W / 2 - 10},${H / 2 - 52} L${W / 2 - 10},${H / 2 - 28} L${W / 2 + 10},${H / 2 - 28} L${W / 2 + 10},${H / 2 - 52} L${W / 2 + 20},${H / 2 - 52} Z`}
        fill="#93C5FD"
      />
      <line x1={W / 2 - 20} y1={H / 2 - 20} x2={W / 2 + 20} y2={H / 2 - 20} stroke="#93C5FD" strokeWidth={4} strokeLinecap="round" />

      {/* Text */}
      <text
        x={W / 2}
        y={H / 2 + 36}
        textAnchor="middle"
        fill="#1E40AF"
        fontSize={26}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
      >
        Upload {label}
      </text>
      <text
        x={W / 2}
        y={H / 2 + 72}
        textAnchor="middle"
        fill="#93C5FD"
        fontSize={18}
        fontFamily="Inter, system-ui, sans-serif"
      >
        PNG · JPG · WEBP · SVG · Any image format
      </text>

      {/* Corner dots */}
      <circle cx={40} cy={40} r={6} fill="#BFDBFE" opacity={0.6} />
      <circle cx={W - 40} cy={40} r={6} fill="#BFDBFE" opacity={0.6} />
      <circle cx={40} cy={H - 40} r={6} fill="#BFDBFE" opacity={0.6} />
      <circle cx={W - 40} cy={H - 40} r={6} fill="#BFDBFE" opacity={0.6} />
    </svg>
  );
}
