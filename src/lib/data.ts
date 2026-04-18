import { supabase, type Business, type Category, type Review } from "./supabase";

/**
 * Get all businesses, optionally featured only
 */
export async function getBusinesses(featuredOnly = false): Promise<Business[]> {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return [];
  }

  let query = supabase
    .from("businesses")
    .select("*")
    .order("name", { ascending: true });

  if (featuredOnly) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching businesses:", error);
    return [];
  }

  return data || [];
}

/**
 * Get a single business by slug
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return null;
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching business by slug:", error);
    return null;
  }

  return data;
}

/**
 * Get all categories ordered by order field
 */
export async function getCategories(): Promise<Category[]> {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return null;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }

  return data;
}

/**
 * Get reviews for a specific business
 */
export async function getReviewsByBusiness(businessId: string): Promise<Review[]> {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("business_id", businessId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data || [];
}

/**
 * Insert a new review (client-side)
 */
export async function insertReview(
  businessId: string,
  authorName: string,
  rating: number,
  comment: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: "Supabase client not initialized" };
  }

  const { error } = await supabase.from("reviews").insert({
    business_id: businessId,
    author_name: authorName,
    rating,
    comment,
    approved: false, // Require moderation
  });

  if (error) {
    console.error("Error inserting review:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get reviews by business slug
 */
export async function getReviewsByBusinessSlug(businessSlug: string): Promise<Review[]> {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return [];
  }

  // First get the business ID from slug
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", businessSlug)
    .single();

  if (businessError || !business) {
    console.error("Error fetching business:", businessError);
    return [];
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("business_id", business.id)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data || [];
}

/**
 * Get businesses by category slug
 */
export async function getBusinessesByCategory(categorySlug: string): Promise<Business[]> {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return [];
  }

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("category", categorySlug)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching businesses by category:", error);
    return [];
  }

  return data || [];
}

/**
 * Search businesses by query (searches name and description)
 */
export async function searchBusinesses(query: string): Promise<Business[]> {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return [];
  }

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error searching businesses:", error);
    return [];
  }

  return data || [];
}