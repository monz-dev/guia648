import { getBusinessBySlug, getCategoryBySlug, getReviewsByBusinessSlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const category = business.category ? await getCategoryBySlug(business.category) : null;
  const reviews = await getReviewsByBusinessSlug(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Camargo",
      "addressRegion": "Chihuahua",
      "addressCountry": "MX",
    },
    "telephone": business.phone ? `+52${business.phone}` : undefined,
    "url": `https://guia648.com/negocio/${business.slug}`,
    "image": business.logo_url,
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": "Camargo",
    },
    "category": category?.name,
  };

  return (
    <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
        {/* Logo */}
        {business.logo_url && (
          <div className="aspect-video w-full bg-stone-200 dark:bg-stone-700">
            <Image
              src={business.logo_url}
              alt={business.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-white mb-2">
                {business.name}
              </h1>
              {category && (
                <Link
                  href={`/directorio/${category.slug}`}
                  className="text-sm text-primary dark:text-accent hover:underline"
                >
                  {category.name}
                </Link>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-stone-600 dark:text-stone-300 mb-8 text-lg">
            {business.description}
          </p>

          {/* Contact */}
          <div className="grid gap-4 mb-8">
            {business.phone && (
              <Link
                href={`tel:${business.phone}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-stone-100 dark:bg-stone-700 hover:bg-primary/10 dark:hover:bg-accent-dark/10 transition-colors"
              >
                <span className="text-xl">📞</span>
                <span className="font-medium text-stone-900 dark:text-white">{business.phone}</span>
              </Link>
            )}

            {business.whatsapp && (
              <Link
                href={`https://wa.me/52${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition-colors"
              >
                <span className="text-xl">💬</span>
                <span className="font-medium text-green-700 dark:text-green-400">WhatsApp</span>
              </Link>
            )}

            {business.address && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-stone-100 dark:bg-stone-700">
                <span className="text-xl">📍</span>
                <span className="text-stone-900 dark:text-white">{business.address}</span>
              </div>
            )}

            {business.google_maps_url && (
              <Link
                href={business.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
              >
                <span className="text-xl">🗺️</span>
                <span className="font-medium text-blue-700 dark:text-blue-400">Ver en Google Maps</span>
              </Link>
            )}
          </div>

          {/* Claim Button */}
          <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700">
            <Link
              href="https://admin-guia648-d46v.vercel.app/auth/claim/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-primary dark:hover:border-accent hover:text-primary dark:hover:text-accent transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Soy el dueño de este negocio
            </Link>
            <p className="text-xs text-stone-500 dark:text-stone-400 text-center mt-2">
              Gestiona tu información en nuestro panel de administración
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6">
          Reseñas ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <p className="text-stone-500">No hay reseñas todavía.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-stone-900 dark:text-white">
                    {review.author_name}
                  </span>
                  <div className="flex text-accent">
                    {"★".repeat(review.rating)}
                  </div>
                </div>
                <p className="text-stone-600 dark:text-stone-400">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}

export async function generateStaticParams() {
  return [];
}

export const dynamic = "force-dynamic";