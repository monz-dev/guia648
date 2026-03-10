---
description: Rules for data fetching in Astro - SSG, client-side, and external APIs
globs:
  - "**/*.astro"
  - "**/data.ts"
  - "**/lib/*"
---

# Astro Data Fetching Rules

## Data Fetching Patterns

Astro supports multiple data fetching strategies depending on your rendering mode:

### 1. Build-Time Fetching (SSG)

Fetch data during build for static pages:

```astro
---
const data = await fetch('https://api.example.com/data').then(r => r.json());
---

<ul>
  {data.items.map(item => <li>{item.name}</li>)}
</ul>
```

### 2. Client-Side Fetching

For dynamic data that updates frequently or when hosting doesn't support SSR:

```astro
---
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
---

<div id="data-container" data-url={supabaseUrl} data-key={supabaseKey}>
  Loading...
</div>

<script is:inline>
  (function() {
    var container = document.getElementById('data-container');
    var url = container.dataset.url;
    var key = container.dataset.key;
    
    fetch(url + '/rest/v1/items', {
      headers: {
        'apikey': key,
        'Authorization': 'Bearer ' + key
      }
    })
    .then(r => r.json())
    .then(data => {
      container.innerHTML = data.map(item => 
        '<li>' + item.name + '</li>'
      ).join('');
    });
  })();
</script>
```

### 3. External API Loaders

Use Astro's content collection loaders for external APIs:

```typescript
// src/content/config.ts
import { defineCollection } from 'astro:content';

const products = defineCollection({
  loader: async () => {
    const response = await fetch("https://api.example.com/products");
    const data = await response.json();
    return data.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
    }));
  },
  schema: z.object({
    name: z.string(),
    price: z.number(),
  }),
});

export const collections = { products };
```

## MUST DO

- Use build-time fetching (`await fetch()` in frontmatter) for static data
- Use client-side fetching for dynamic/realtime data in SSG sites
- Pass sensitive credentials via server-side variables, never in client code
- Use `is:inline` for scripts that need to access Astro variables
- Use `define:vars` to pass props to client scripts (implicitly makes script inline)
- Consider using content collection loaders for external API data

## MUST NOT DO

- Access `window`, `document`, or browser APIs in frontmatter (runs on server)
- Store API keys in client-accessible code
- Use `client:*` directives when no interactivity is needed
- Fetch data inside component templates (must be in frontmatter or client scripts)
- Forget that `define:vars` makes scripts inline (no bundling)

## Passing Data to Client Scripts

### Method 1: Data Attributes (Recommended for inline scripts)

```astro
---
const config = { apiUrl: 'https://api.example.com', limit: 10 };
---

<div id="app" data-config={JSON.stringify(config)} />

<script is:inline>
  const config = JSON.parse(document.getElementById('app').dataset.config);
  // Use config.apiUrl, config.limit
</script>
```

### Method 2: define:vars

```astro
---
const message = "Hello from server";
const count = 5;
---

<script define:vars={{ message, count }}>
  console.log(message, count); // Available in client
</script>
```

Note: `define:vars` implies `is:inline`, meaning the script won't be bundled.

### Method 3: Props to Framework Components

```astro
---
import Counter from './Counter.jsx';
const initialCount = 10;
---

<Counter client:load initialCount={initialCount} />
```

## SSG + External Database Example (Supabase)

```astro
---
// Build-time: fetch static data
import { supabase } from '../lib/supabase';
const businesses = await supabase.from('businesses').select('*');
---

{/* Client-time: fetch dynamic data via REST API */}
<div 
  id="reviews" 
  data-slug="business-slug"
  data-url={import.meta.env.PUBLIC_SUPABASE_URL}
  data-key={import.meta.env.PUBLIC_SUPABASE_ANON_KEY}
/>

<script is:inline>
  // Fetch reviews on page load
  const container = document.getElementById('reviews');
  const slug = container.dataset.slug;
  const url = container.dataset.url;
  const key = container.dataset.key;
  
  // 1. Get business ID
  fetch(url + '/rest/v1/businesses?slug=eq.' + slug, {
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
  })
  .then(r => r.json())
  .then(bs => {
    if (!bs.length) return;
    // 2. Get reviews
    return fetch(url + '/rest/v1/reviews?business_id=eq.' + bs[0].id, {
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
    });
  })
  .then(r => r.json())
  .then(reviews => {
    // Render reviews
  });
</script>
```

## When to Use Which Approach

| Scenario | Approach |
|----------|----------|
| Static content (blog, docs) | Build-time + Content Collections |
| Data changes rarely | Build-time fetch in frontmatter |
| Real-time/dynamic data | Client-side fetch |
| External API as CMS | Content Collection Loaders |
| Database (Supabase, Firebase) | Client-side REST API |
| SSR available | Server-side fetch in frontmatter |
