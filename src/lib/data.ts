import { supabase, type Database } from './supabase';

export type Business = Database['public']['Tables']['businesses']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];

/**
 * Get all businesses, optionally featured only
 */
export async function getBusinesses(featuredOnly = false): Promise<Business[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return [];
  }

  let query = supabase
    .from('businesses')
    .select('*')
    .order('name', { ascending: true });

  if (featuredOnly) {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching businesses:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single business by slug
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return null;
  }

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching business by slug:', error);
    return null;
  }

  return data;
}

/**
 * Get all categories ordered by order field
 */
export async function getCategories(): Promise<Category[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return [];
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return null;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }

  return data;
}

/**
 * Get reviews for a specific business
 */
export async function getReviewsByBusiness(businessId: string): Promise<Review[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return [];
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

/**
 * Get businesses by category slug
 */
export async function getBusinessesByCategory(categorySlug: string): Promise<Business[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return [];
  }

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('slug')
    .eq('slug', categorySlug)
    .single();

  if (categoryError || !category) {
    console.error('Error fetching category:', categoryError);
    return [];
  }

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('category', category.slug)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching businesses by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Search businesses by query (searches name and description)
 */
export async function searchBusinesses(query: string): Promise<Business[]> {
  if (!supabase) {
    console.warn('Supabase client not initialized');
    return [];
  }

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error searching businesses:', error);
    return [];
  }

  return data || [];
}
