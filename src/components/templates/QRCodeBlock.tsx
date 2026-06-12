"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CardData } from "@/types/card";

interface Props {
  data: CardData;
  x: number;
  y: number;
  size: number;
  darkColor?: string;
  lightColor?: string;
}

export function getQRValue(data: CardData): string {
  switch (data.qrCodeType) {
    case "website":
      return data.qrCodeValue || data.website || "";
    case "linkedin":
      return data.qrCodeValue || data.linkedin || "";
    case "custom":
      return data.qrCodeValue || "";
    case "vcard":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${data.fullName}`,
        data.designation ? `TITLE:${data.designation}` : "",
        data.company ? `ORG:${data.company}` : "",
        data.phone ? `TEL;TYPE=WORK,VOICE:${data.phone}` : "",
        data.mobile ? `TEL;TYPE=CELL:${data.mobile}` : "",
        data.email ? `EMAIL:${data.email}` : "",
        data.website ? `URL:${data.website}` : "",
        data.address ? `ADR:;;${data.address}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\r\n");
    default:
      return data.website || "";
  }
}

export default function QRCodeBlock({
  data,
  x,
  y,
  size,
  darkColor = "#000000",
  lightColor = "#ffffff",
}: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const value = getQRValue(data);

  useEffect(() => {
    if (!data.showQR || !value) {
      setDataUrl(null);
      return;
    }
    QRCode.toDataURL(value, {
      width: Math.round(size * 3),
      margin: 1,
      color: { dark: darkColor, light: lightColor },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [value, data.showQR, size, darkColor, lightColor]);

  if (!data.showQR || !dataUrl) return null;

  return <image href={dataUrl} x={x} y={y} width={size} height={size} />;
}
