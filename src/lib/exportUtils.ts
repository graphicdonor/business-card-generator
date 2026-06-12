import { CardData } from "@/types/card";

export async function exportAsPNG(elementId: string, filename: string = "business-card"): Promise<void> {
  const { default: html2canvas } = await import("html2canvas");
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Element not found");

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: null,
  });

  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function exportAsPDF(elementId: string, filename: string = "business-card"): Promise<void> {
  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");

  const element = document.getElementById(elementId);
  if (!element) throw new Error("Element not found");

  const canvas = await html2canvas(element, {
    scale: 4,
    useCORS: true,
    backgroundColor: null,
  });

  // US card: 3.5 x 2 inches
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "in",
    format: [3.5, 2],
  });

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, 3.5, 2);
  pdf.save(`${filename}.pdf`);
}

export function exportAsSVG(svgElementId: string, filename: string = "business-card"): void {
  const svgElement = document.getElementById(svgElementId)?.querySelector("svg");
  if (!svgElement) throw new Error("SVG element not found");

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement("a");
  link.download = `${filename}.svg`;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

export function generateVCard(data: CardData): string {
  const nameParts = (data.fullName || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${lastName};${firstName};;;`,
    `FN:${data.fullName}`,
    data.company ? `ORG:${data.company}` : "",
    data.designation ? `TITLE:${data.designation}` : "",
    data.email ? `EMAIL:${data.email}` : "",
    data.phone ? `TEL;TYPE=WORK:${data.phone}` : "",
    data.mobile ? `TEL;TYPE=CELL:${data.mobile}` : "",
    data.website ? `URL:${data.website}` : "",
    data.address ? `ADR:;;${data.address};;;;` : "",
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\n");
}

export function getQRValue(data: CardData): string {
  switch (data.qrCodeType) {
    case "website":
      return data.website || data.qrCodeValue || "";
    case "linkedin":
      return data.linkedin || data.qrCodeValue || "";
    case "vcard":
      return generateVCard(data);
    case "custom":
      return data.qrCodeValue || "";
    default:
      return data.qrCodeValue || data.website || "";
  }
}
