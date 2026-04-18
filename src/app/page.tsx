import { getCategories, getBusinesses } from "@/lib/data";
import { CategoryIcon } from "@/components/CategoryIcon";
import { BusinessCard } from "@/components/BusinessCard";
import Link from "next/link";

// Force dynamic rendering for SSR
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await getCategories();
  const businesses = await getBusinesses();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Guia648 - Directorio de Camargo",
    description:
      "Directorio digital de comercios y servicios de Camargo, Chihuahua. Encuentra turismo, gastronomía, salud y más.",
    url: "https://guia648.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://guia648.com/buscar?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    areaServed: {
      "@type": "City",
      name: "Camargo",
      addressRegion: "Chihuahua",
      addressCountry: "MX",
    },
  };

  return (
    <main>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero/hero.webp"
            alt="Camargo, Chihuahua"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 md:bg-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-white drop-shadow-lg">
            Descubre Camargo
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-white/90 drop-shadow-md">
            El directorio de comercios y servicios locales
          </p>

          {/* Search Bar */}
          <form
            action="/buscar"
            method="get"
            className="flex flex-col sm:flex-row gap-2 sm:gap-2 max-w-xl mx-auto"
          >
            <input
              type="search"
              name="q"
              placeholder="Buscar: nuts, restaurant, pharmacy..."
              className="flex-1 px-4 py-3 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent text-base"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary dark:bg-accent-dark text-white font-semibold rounded-lg hover:bg-primary-dark dark:hover:bg-accent transition-colors whitespace-nowrap"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-900 dark:text-white">
          Explora por Categoría
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/directorio/${category.slug}`}
              className="p-6 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-primary dark:hover:border-accent hover:shadow-lg transition-all text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 dark:bg-accent-dark/10 flex items-center justify-center">
                <CategoryIcon
                  icon={category.icon || "map"}
                  className="w-6 h-6 text-primary dark:text-accent"
                />
              </div>
              <h3 className="font-semibold text-stone-900 dark:text-white">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 px-4 bg-stone-100 dark:bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-stone-900 dark:text-white">
            Negocios Destacados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businesses
              .filter((b) => b.featured)
              .map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}