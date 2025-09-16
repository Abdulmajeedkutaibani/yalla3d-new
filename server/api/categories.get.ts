// server/api/categories.get.ts
import {
  getSupabase,
  toCategories,
  type SupabaseProductRow,
} from '~~/server/utils/supabase';

export default cachedEventHandler(
  async () => {
    const supabase = getSupabase();
    if (!supabase) return { productCategories: { nodes: [] } };
    const { data = [] } = await supabase.from('products').select('*');
    return toCategories(data as SupabaseProductRow[]);
  },
  { maxAge: 60 * 60, swr: true }
);
