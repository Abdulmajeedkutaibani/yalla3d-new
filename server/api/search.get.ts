// server/api/search.get.ts
import {
  getSupabase,
  rowToCard,
  type SupabaseProductRow,
} from '~~/server/utils/supabase';

export default cachedEventHandler(
  async (event) => {
    const { search = '' } = getQuery(event) as { search?: string };
    const supabase = getSupabase();
    if (!supabase) return { products: { nodes: [] } };
    const { data = [] } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${search}%`)
      .limit(6);
    const nodes = (data as SupabaseProductRow[]).map(rowToCard);
    return { products: { nodes } };
  },
  { maxAge: 60, swr: true, getKey: (event) => event.req.url! }
);
