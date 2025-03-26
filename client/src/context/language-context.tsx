import { createContext, useContext, useEffect } from "react";
import { useLanguage, type Language } from "../hooks/use-language";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, toggleLanguage, isRTL } = useLanguage();
  
  useEffect(() => {
    // Apply RTL direction to the document
    const html = document.documentElement;
    html.setAttribute("dir", isRTL ? "rtl" : "ltr");
    html.setAttribute("lang", language);
    
    // Add appropriate CSS class for RTL styling
    if (isRTL) {
      html.classList.add("rtl");
    } else {
      html.classList.remove("rtl");
    }
  }, [language, isRTL]);
  
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguageContext must be used within a LanguageProvider");
  }
  return context;
}