// server/utils/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached;
  const config = useRuntimeConfig();
  const url = config.supabase?.url;
  const anonKey = config.supabase?.anonKey;
  if (!url || !anonKey) return null;
  cached = createClient(url, anonKey, { auth: { persistSession: false } });
  return cached;
}

// Shapes expected by the app UI
type Image = { sourceUrl: string };

export type SupabaseProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  material?: string | null;
  image: string;
  featured: boolean;
  sku?: string | null;
  stock?: number | null;
};

export function rowToCard(row: SupabaseProductRow) {
  const price = `$${Number(row.price).toFixed(2)}`;
  const sku = row.sku || `${row.id}`;
  const slug = slugify(row.name);
  return {
    sku,
    slug,
    name: row.name,
    regularPrice: price,
    salePrice: price,
    allPaStyle: { nodes: [{ name: row.material || 'Generic' }] },
    image: { sourceUrl: row.image } as Image,
    galleryImages: { nodes: [{ sourceUrl: row.image } as Image] },
  };
}

export function rowToDetail(row: SupabaseProductRow) {
  const price = `$${Number(row.price).toFixed(2)}`;
  const sku = row.sku || `${row.id}`;
  const slug = slugify(row.name);
  const stock =
    typeof (row as any).stock === 'number'
      ? Number((row as any).stock)
      : Number((row as any).stock || 0);
  return {
    databaseId: row.id,
    sku,
    slug,
    name: row.name,
    regularPrice: price,
    salePrice: price,
    description: row.description || '',
    image: { sourceUrl: row.image } as Image,
    galleryImages: { nodes: [{ sourceUrl: row.image } as Image] },
    allPaColor: { nodes: [{ name: 'Default' }] },
    allPaStyle: { nodes: [{ name: row.material || 'Generic' }] },
    productTypes: { nodes: [{ products: { nodes: [] } }] },
    variations: {
      nodes: [
        {
          databaseId: row.id,
          stockStatus: stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
          stockQuantity: stock,
          attributes: { nodes: [{ value: 'm' }] },
          image: { sourceUrl: row.image } as Image,
          regularPrice: price,
          salePrice: price,
        },
      ],
    },
    related: { nodes: [] },
    category: row.category,
  };
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function toCategories(rows: SupabaseProductRow[]) {
  const map = new Map<string, SupabaseProductRow[]>();
  for (const r of rows) {
    const key = r.category || 'Uncategorized';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const nodes = Array.from(map.entries()).map(([name, items], idx) => ({
    id: `cat-${idx}`,
    name,
    image: items[0]?.image ? { sourceUrl: items[0].image } : undefined,
    products: { nodes: items.slice(0, 1).map((i) => ({ id: String(i.id) })) },
    children: { nodes: [] as any[] },
  }));
  return { productCategories: { nodes } };
}
