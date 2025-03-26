import { Link } from "wouter";

interface MobileNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function MobileNav({ currentPage, setCurrentPage }: MobileNavProps) {
  const navItems = [
    { label: "Dashboard", path: "/", icon: "dashboard" },
    { label: "Clients", path: "/clients", icon: "people" },
    { label: "Orders", path: "/orders", icon: "shopping_cart" },
    { label: "Invoices", path: "/invoices", icon: "receipt" },
    { label: "More", path: "/settings", icon: "more_horiz" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex justify-around z-10">
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
          <span className="material-icons">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
