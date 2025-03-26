import { Link } from "wouter";
import { useLanguageContext } from "../../context/language-context";
import { useTranslation } from "../../lib/translations";

interface MobileNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function MobileNav({ currentPage, setCurrentPage }: MobileNavProps) {
  const { language, isRTL } = useLanguageContext();
  const { t } = useTranslation(language);
  
  const navItems = [
    { label: "Dashboard", path: "/", icon: "dashboard", translation: t("dashboard") },
    { label: "Clients", path: "/clients", icon: "people", translation: t("clients") },
    { label: "Orders", path: "/orders", icon: "shopping_cart", translation: t("orders") },
    { label: "Invoices", path: "/invoices", icon: "receipt", translation: t("invoices") },
    { label: "More", path: "/settings", icon: "more_horiz", translation: t("settings") },
  ];

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex justify-around z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.path}
          onClick={() => setCurrentPage(item.label)}
          className={`p-3 flex flex-col items-center text-xs ${
            currentPage === item.label
              ? "text-primary-dark dark:text-primary-light"
              : "text-neutral-500 dark:text-neutral-300"
          }`}
        >
          <span className={`material-icons ${isRTL && ['chevron_left', 'chevron_right'].includes(item.icon) ? 'mirror-rtl' : ''}`}>
            {item.icon}
          </span>
          <span>{item.translation}</span>
        </Link>
      ))}
    </div>
  );
}
