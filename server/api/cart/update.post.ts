// server/api/cart/update.post.ts
import { getSupabase, type SupabaseProductRow } from '~~/server/utils/supabase';

type UpdateItem = { key: string; quantity: number };

export default defineEventHandler(async (event) => {
  const body = await readBody<{ items: UpdateItem[] }>(event);
  const items = Array.isArray(body?.items) ? body.items : [];
  // Validate items against stock in Supabase mode; respond with accepted keys
  const supabase = getSupabase();
  if (!supabase)
    return {
      updateItemQuantities: { items: items.map((i) => ({ key: i.key })) },
    };

  const accepted: Array<{ key: string }> = [];
  for (const i of items) {
    const id = Number(String(i.key).replace(/^sb-/, ''));
    if (!Number.isFinite(id)) continue;
    const { data = [] } = await supabase
      .from('products')
      .select('stock')
      .eq('id', id)
      .limit(1);
    const row = (data as Partial<SupabaseProductRow & { stock?: number }>[])[0];
    const stock = Number((row as any)?.stock ?? 0);
    if (stock >= i.quantity) accepted.push({ key: i.key });
  }
  return { updateItemQuantities: { items: accepted } };
});
