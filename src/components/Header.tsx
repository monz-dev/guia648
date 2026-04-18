"use client";

import Link from "next/link";
import { useTheme } from "./providers/ThemeProvider";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Turismo", href: "/directorio/turismo" },
  { name: "Gastronomía", href: "/directorio/gastronomia" },
  { name: "Salud", href: "/directorio/salud" },
  { name: "Servicios", href: "/directorio/servicios" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full bg-white dark:bg-sand-dark border-b border-stone-200 dark:border-stone-800 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/images/logo.png" alt="Guia648" className="h-12 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-stone-600 dark:text-stone-300"
          aria-label="Abrir menú"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-sand-dark border-t border-stone-200 dark:border-stone-800">
          <div className="px-4 py-3 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2 text-sm font-medium hover:text-primary dark:hover:text-accent transition-colors"
            >
              {theme === "light" ? "🌙 Oscuro" : "☀️ Claro"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}