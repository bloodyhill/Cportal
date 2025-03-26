import React, { useEffect } from "react";
import { useLocalStorage } from "../../hooks/use-local-storage";

export interface ModeToggleProps {
  className?: string;
}

export function ModeToggle({ className = "" }: ModeToggleProps) {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("darkMode", false);
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`relative inline-block w-10 mr-2 align-middle select-none ${className}`}>
      <input 
        type="checkbox" 
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
        id="dark-mode-toggle"
      />
      <label 
        htmlFor="dark-mode-toggle" 
        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
      />
    </div>
  );
}
