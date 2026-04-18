import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-sand-dark border-t border-stone-200 dark:border-stone-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-600 dark:text-stone-400">
              © {new Date().getFullYear()} Guia648
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400">
            <Link 
              href="https://admin-guia648.vercel.app" 
              target="_blank"
              className="hover:text-primary dark:hover:text-accent transition-colors"
            >
              Admin
            </Link>
            <span>•</span>
            <span>Camargo, Chihuahua</span>
          </div>
        </div>
      </div>
    </footer>
  );
}