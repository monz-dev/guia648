import { getCategories, getBusinesses, searchBusinesses } from "@/lib/data";
import { BusinessCard } from "@/components/BusinessCard";
import { Suspense } from "react";

interface SearchParams {
  q?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const categories = await getCategories();
  const businesses = await getBusinesses();

  const query = q || "";
  const results = query ? await searchBusinesses(query) : businesses;

  const pageDescription = query
    ? `Resultados de búsqueda para "${query}" en Camargo, Chihuahua`
    : "Buscar negocios, restaurantes, hoteles, servicios y más en Camargo, Chihuahua";

  return (
    <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-4">
          Buscar Negocios
        </h1>

        {/* Search Form */}
        <div className="relative">
          <input
            type="search"
            id="search-input"
            name="q"
            defaultValue={query}
            placeholder="Buscar: restaurante, hotel, farmacia..."
            className="w-full md:w-auto md:min-w-[300px] px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
            autoFocus
          />
        </div>
      </div>

      {/* No query - show all businesses */}
      {!query && (
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
            Todos los Negocios ({businesses.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      )}

      {/* With query - show results */}
      {query && (
        <div>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            {results.length} {results.length === 1 ? "resultado" : "resultados"} para "{query}"
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-stone-600 dark:text-stone-400 mb-4">
                No se encontraron negocios
              </p>
              <p className="text-stone-500 dark:text-stone-500">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";