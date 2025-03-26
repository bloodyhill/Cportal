import { useLocalStorage } from "./use-local-storage";

export type Language = "ar" | "en";

export function useLanguage() {
  const [language, setLanguage] = useLocalStorage<Language>("language", "ar");
  
  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };
  
  return { language, toggleLanguage, isRTL: language === "ar" };
}