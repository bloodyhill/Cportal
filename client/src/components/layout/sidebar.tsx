import { ModeToggle } from "../ui/mode-toggle";
import { Link } from "wouter";
import { useAuth } from "../../context/auth-context";

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { user } = useAuth();

  const navItems = [
    { label: "Dashboard", path: "/", icon: "dashboard" },
    { label: "Clients", path: "/clients", icon: "people" },
    { label: "Orders", path: "/orders", icon: "shopping_cart" },
    { label: "Invoices", path: "/invoices", icon: "receipt" },
    { label: "Reports", path: "/reports", icon: "bar_chart" },
    { label: "Settings", path: "/settings", icon: "settings" },
  ];

  return (
    <aside className="bg-white dark:bg-neutral-800 w-full md:w-64 md:min-h-screen shadow-md md:flex md:flex-col hidden md:block">
      <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
        <h1 className="font-medium text-xl text-primary-dark dark:text-primary-light">Marketing CRM</h1>
        <ModeToggle />
      </div>
      <nav className="py-4">
        <ul>
          {navItems.map((item) => (
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
                <span className="material-icons mr-3">{item.icon}</span> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {user && (
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-dark text-white flex items-center justify-center mr-3">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
