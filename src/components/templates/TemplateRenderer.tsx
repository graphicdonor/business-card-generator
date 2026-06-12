"use client";

import { CardData } from "@/types/card";
import CorporateBlue from "./CorporateBlue";
import MinimalWhite from "./MinimalWhite";
import DarkLuxury from "./DarkLuxury";
import TechModern from "./TechModern";
import FinanceGold from "./FinanceGold";
import MedicalClean from "./MedicalClean";
import RealEstate from "./RealEstate";
import CreativeVibrant from "./CreativeVibrant";
import CustomTemplate from "./CustomTemplate";
import BoldChevron from "./BoldChevron";
import RDashPro from "./RDashPro";

interface Props {
  templateId: string;
  data: CardData;
  side?: "front" | "back";
  scale?: number;
}

export default function TemplateRenderer({ templateId, data, side = "front", scale = 1 }: Props) {
  const props = { data, side, scale };

  switch (templateId) {
    case "corporate-blue":
      return <CorporateBlue {...props} />;
    case "minimal-white":
      return <MinimalWhite {...props} />;
    case "dark-luxury":
      return <DarkLuxury {...props} />;
    case "tech-modern":
      return <TechModern {...props} />;
    case "finance-gold":
      return <FinanceGold {...props} />;
    case "medical-clean":
      return <MedicalClean {...props} />;
    case "real-estate":
      return <RealEstate {...props} />;
    case "creative-color":
      return <CreativeVibrant {...props} />;
    case "bold-chevron":
      return <BoldChevron {...props} />;
    case "rdash-pro":
      return <RDashPro {...props} />;
    case "custom-upload":
      return <CustomTemplate {...props} />;
    default:
      return <CorporateBlue {...props} />;
  }
}
