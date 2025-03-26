import { ModeToggle } from "../ui/mode-toggle";
import { LanguageToggle } from "../ui/language-toggle";
import { useAuth } from "../../context/auth-context";
import { useLanguageContext } from "../../context/language-context";
import { useTranslation } from "../../lib/translations";
import { useState } from "react";

interface HeaderProps {
  currentPage: string;
}

export default function Header({ currentPage }: HeaderProps) {
  const { user, logout } = useAuth();
  const { language, isRTL } = useLanguageContext();
  const { t } = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState("");

  const headerDirectionClass = isRTL ? "space-x-reverse" : "space-x-4";

  // Translate the current page title
  const translatedPageTitle = t(currentPage.toLowerCase() as any);

  return (
    <header className="bg-white dark:bg-neutral-800 shadow-sm">
      <div className="flex justify-between items-center p-4">
        <div className="md:hidden flex items-center">
          <h1 className="font-medium text-xl text-primary-dark dark:text-primary-light">Marketing CRM</h1>
          <ModeToggle className="ml-4" />
        </div>
        <div className="hidden md:block">
          <h2 className="text-2xl font-medium text-neutral-600 dark:text-neutral-200">{translatedPageTitle}</h2>
        </div>
        <div className={`flex items-center ${headerDirectionClass}`}>
          <div className="relative">
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-neutral-200"
            />
            <span className={`material-icons absolute ${isRTL ? 'right-3' : 'left-3'} top-2 text-neutral-400 dark:text-neutral-500`}>search</span>
          </div>
          
          <LanguageToggle className="mx-2" />
          
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
              title="Notifications"
            >
              <span className="material-icons text-neutral-500 dark:text-neutral-300">notifications</span>
            </button>
          </div>
          
          <ModeToggle className="hidden md:block" />
          
          {user && (
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700"
                onClick={logout}
                title={t('logOut')}
              >
                <span className="material-icons text-neutral-500 dark:text-neutral-300">logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
