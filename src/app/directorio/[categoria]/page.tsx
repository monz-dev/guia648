import { getCategoryBySlug, getBusinessesByCategory } from "@/lib/data";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/BusinessCard";

interface PageProps {
  params: Promise<{
    categoria: string;
  }>;
}

const categoryDescriptions: Record<string, string> = {
  turismo: "Hoteles, atractivos turísticos y actividades en Camargo, Chihuahua.",
  gastronomia: "Restaurantes, cafeterías y gastronomía local en Camargo, Chihuahua.",
  salud: "Farmacias, clínicas y servicios de salud en Camargo, Chihuahua.",
  servicios: "Talleres, profesionistas y servicios diversos en Camargo, Chihuahua.",
};

export default async function DirectoryPage({ params }: PageProps) {
  const { categoria } = await params;
  const category = await getCategoryBySlug(categoria);

  if (!category) {
    notFound();
  }

  const businesses = await getBusinessesByCategory(categoria);
  const description = categoryDescriptions[categoria] || `Negocios de ${category.name} en Camargo, Chih.`;

  return (
    <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-white mb-2">
          {category.name}
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          {businesses.length} {businesses.length === 1 ? 'negocio' : 'negocios'} encontrados
        </p>
      </div>

      {businesses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-stone-600 dark:text-stone-400 mb-4">
            No se encontraron negocios
          </p>
          <p className="text-stone-500 dark:text-stone-500">
            Prueba con otra categoría
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  return [];
}

export const dynamic = "force-dynamic";