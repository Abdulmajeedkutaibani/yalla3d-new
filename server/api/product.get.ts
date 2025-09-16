// server/api/product.get.ts
import {
  getSupabase,
  rowToDetail,
  type SupabaseProductRow,
} from '~~/server/utils/supabase';

export default cachedEventHandler(
  async (event) => {
    const { slug, sku } = getQuery(event) as { slug?: string; sku?: string };
    const supabase = getSupabase();
    if (!supabase) return { product: null };
    let row: SupabaseProductRow | undefined;
    if (sku && /^\d+$/.test(String(sku))) {
      const { data = [] } = await supabase
        .from('products')
        .select('*')
        .eq('id', Number(sku))
        .limit(1);
      row = (data as SupabaseProductRow[])[0];
    } else if (slug) {
      const pattern = String(slug).replace(/-/g, ' ');
      const { data = [] } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${pattern}%`)
        .limit(1);
      row = (data as SupabaseProductRow[])[0];
    }
    if (!row)
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    return { product: rowToDetail(row) };
  },
  { maxAge: 60 * 5, swr: true, getKey: (event) => event.req.url! }
);
