import Link from "next/link";
import type { Business } from "@/lib/supabase";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link
      href={`/negocio/${business.slug}`}
      className="block p-6 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-primary dark:hover:border-accent hover:shadow-lg transition-all"
    >
      <div className="relative aspect-video rounded-lg bg-stone-200 dark:bg-stone-700 mb-4 flex items-center justify-center overflow-hidden">
        {business.logo_url ? (
          <img
            src={business.logo_url || undefined}
            alt={business.name || ''}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        ) : (
          <span className="text-stone-400">Sin imagen</span>
        )}
      </div>
      <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-2">
        {business.name}
      </h3>
      <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
        {business.description}
      </p>
      {business.phone && (
        <span className="mt-3 inline-flex items-center text-sm text-primary dark:text-accent">
          📞 {business.phone}
        </span>
      )}
    </Link>
  );
}