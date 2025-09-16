// server/api/products.get.ts
import {
  getSupabase,
  rowToCard,
  type SupabaseProductRow,
} from '~~/server/utils/supabase';

export default cachedEventHandler(
  async (event) => {
    const {
      after,
      search,
      category,
      order = 'DESC',
    } = getQuery(event) as Record<string, string | undefined>;
    const supabase = getSupabase();
    if (!supabase) {
      return {
        products: {
          nodes: [],
          pageInfo: { hasNextPage: false, endCursor: null },
        },
      };
    }

    let querySb = supabase.from('products').select('*');
    if (search) querySb = querySb.ilike('name', `%${search}%`);
    if (category) querySb = querySb.ilike('category', `%${category}%`);
    querySb = querySb.order('name', {
      ascending: String(order).toUpperCase() !== 'DESC',
    });
    const { data = [] } = await querySb;
    const all = (data as SupabaseProductRow[]).map(rowToCard);

    const start = after ? parseInt(String(after), 10) || 0 : 0;
    const first = 21;
    const slice = all.slice(start, start + first);
    const endCursor = start + slice.length;

    return {
      products: {
        nodes: slice,
        pageInfo: {
          hasNextPage: endCursor < all.length,
          endCursor: String(endCursor),
        },
      },
    };
  },
  { maxAge: 60, swr: true, getKey: (event) => event.req.url! }
);
