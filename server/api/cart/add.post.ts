// server/api/cart/add.post.ts
import {
  getSupabase,
  slugify,
  type SupabaseProductRow,
} from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody<{ productId?: number }>(event);
  const productId = Number(body?.productId);
  if (!Number.isFinite(productId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid product' });
  }
  const supabase = getSupabase();
  if (!supabase)
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase not configured',
    });

  const { data = [] } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .limit(1);
  const row = (data as SupabaseProductRow[])[0];
  if (!row)
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  const stock = Number((row as any).stock ?? 0);
  if (!Number.isFinite(stock) || stock <= 0) {
    throw createError({ statusCode: 409, statusMessage: 'Insufficient stock' });
  }

  const price = `$${Number(row.price).toFixed(2)}`;
  const name = row.name;
  const cartItem = {
    key: `sb-${row.id}`,
    quantity: 1,
    product: {
      node: {
        sku: row.sku || `${row.id}`,
        slug: slugify(name),
        name,
      },
    },
    variation: {
      node: {
        name,
        databaseId: row.id,
        salePrice: price,
        regularPrice: price,
        stockQuantity: stock,
        stockStatus: stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
        image: { sourceUrl: row.image },
      },
      attributes: [{ value: 'm' }],
    },
  };

  return { addToCart: { cartItem } };
});
