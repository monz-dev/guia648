---
import { getBusinesses, getCategories } from '../lib/data';

const siteUrl = 'https://guia648.com';
const categories = await getCategories();
const businesses = await getBusinesses();

// Generate URLs
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/buscar', priority: '0.9', changefreq: 'daily' },
  ...categories.map(cat => ({
    url: `/directorio/${cat.slug}`,
    priority: '0.8',
    changefreq: 'weekly'
  })),
  ...businesses.map(biz => ({
    url: `/negocio/${biz.slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }))
];

const today = new Date().toISOString().split('T')[0];
---

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {staticPages.map(page => (
    <url>
      <loc>{siteUrl}{page.url}</loc>
      <lastmod>{today}</lastmod>
      <changefreq>{page.changefreq}</changefreq>
      <priority>{page.priority}</priority>
    </url>
  ))}
</urlset>
