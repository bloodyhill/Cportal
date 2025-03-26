import { ModeToggle } from "../ui/mode-toggle";
import { LanguageToggle } from "../ui/language-toggle";
import { Link } from "wouter";
import { useAuth } from "../../context/auth-context";
import { useLanguageContext } from "../../context/language-context";
import { useTranslation } from "../../lib/translations";
import { hasPermission, type Permission } from "@/lib/permissions";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { user, logout } = useAuth();
  const { language, isRTL } = useLanguageContext();
  const { t } = useTranslation(language);

  const navItems = [
    { 
      label: "Dashboard", 
      path: "/", 
      icon: "dashboard", 
      translation: t("dashboard"),
      permission: "view_dashboard" as Permission
    },
    { 
      label: "Clients", 
      path: "/clients", 
      icon: "people", 
      translation: t("clients"),
      permission: "view_clients" as Permission
    },
    { 
      label: "Orders", 
      path: "/orders", 
      icon: "shopping_cart", 
      translation: t("orders"),
      permission: "view_orders" as Permission
    },
    { 
      label: "Invoices", 
      path: "/invoices", 
      icon: "receipt", 
      translation: t("invoices"),
      permission: "view_invoices" as Permission
    },
    { 
      label: "Reports", 
      path: "/reports", 
      icon: "bar_chart", 
      translation: t("reports"),
      permission: "view_reports" as Permission
    },
    { 
      label: "Settings", 
      path: "/settings", 
      icon: "settings", 
      translation: t("settings"),
      permission: "view_settings" as Permission
    },
  ];

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(item => 
    hasPermission(user, item.permission)
  );

  return (
    <aside className="bg-white dark:bg-neutral-800 w-full md:w-64 md:min-h-screen shadow-md md:flex md:flex-col hidden md:block" dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
        <h1 className="font-medium text-xl text-primary-dark dark:text-primary-light">Marketing CRM</h1>
        <div className="flex items-center space-x-2">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
      <nav className="py-4">
        <ul>
          {filteredNavItems.map((item) => (
            <li className="mb-1" key={item.label}>
              <Link
                href={item.path}
                onClick={() => setCurrentPage(item.label)}
                className={`block px-4 py-2 flex items-center hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg mx-2 ${
                  currentPage === item.label
                    ? "text-primary-dark dark:text-primary-light"
                    : "text-neutral-500 dark:text-neutral-300"
                }`}
              >
                <span className={`material-icons ${isRTL ? 'ml-3' : 'mr-3'}`}>{item.icon}</span> 
                {item.translation}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {user && (
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full bg-primary-dark text-white flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">{t(user.role.toLowerCase() as any)}</p>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
              title={t("logOut")}
            >
              <span className="material-icons text-neutral-500 dark:text-neutral-400 text-sm">
                logout
              </span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
