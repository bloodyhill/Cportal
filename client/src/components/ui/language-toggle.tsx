import React from "react";
import { useLanguageContext } from "@/context/language-context";
import { Button } from "./button";

export interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguageContext();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`px-3 ${className}`}
    >
      {language === "ar" ? "English" : "العربية"}
    </Button>
  );
}