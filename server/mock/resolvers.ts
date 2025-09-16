// server/mock/resolvers.ts
import type { RequestDocument, Variables } from 'graphql-request';
import {
  findProductBySlug,
  findVariationById,
  mockCategories,
  mockProducts,
  toCard,
} from './data';
import {
  getSupabase,
  rowToCard,
  rowToDetail,
  toCategories,
  slugify,
  type SupabaseProductRow,
} from '../utils/supabase';

function getOperationName(query: RequestDocument): string {
  const source =
    typeof query === 'string' ? query : (query as any)?.loc?.source?.body || '';
  const m = source.match(/\b(query|mutation)\s+(\w+)/);
  return m?.[2] || '';
}

function paginate<T>(items: T[], after?: string, first = 21) {
  const start = after ? parseInt(String(after), 10) || 0 : 0;
  const slice = items.slice(start, start + first);
  const endCursor = start + slice.length;
  return {
    nodes: slice,
    pageInfo: {
      hasNextPage: endCursor < items.length,
      endCursor: String(endCursor),
    },
  };
}

export async function mockRequest<T = unknown>(
  query: RequestDocument,
  variables?: Variables
): Promise<T> {
  const op = getOperationName(query);
  const supabase = getSupabase();

  // Queries
  if (op === 'getProducts') {
    const {
      search,
      category,
      order = 'DESC',
      field = 'DATE',
      after,
    } = (variables || {}) as any;
    if (supabase) {
      let querySb = supabase.from('products').select('*');
      if (search) querySb = querySb.ilike('name', `%${search}%`);
      if (category) querySb = querySb.ilike('category', `%${category}%`);
      // Sort by name as a simple default
      querySb = querySb.order('name', {
        ascending: String(order).toUpperCase() !== 'DESC',
      });
      const { data = [] } = await querySb;
      const cards = (data as SupabaseProductRow[]).map(rowToCard);
      const page = paginate(cards, after, 21);
      return { products: page } as T;
    }
    // Fallback to mock
    const vars: any = variables || {};
    let list = mockProducts.slice();
    if (vars.search) {
      const s = String(vars.search).toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
      );
    }
    if (vars.category) {
      const c = String(vars.category).toLowerCase();
      list = list.filter((p) => p.category.toLowerCase().includes(c));
    }
    const isDesc = String(vars.order || 'DESC').toUpperCase() === 'DESC';
    list.sort((a, b) =>
      isDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    );
    const cards = list.map(toCard);
    const page = paginate(cards, vars.after, 21);
    return { products: page } as T;
  }

  if (op === 'getSearchProducts') {
    const { search = '' } = (variables || {}) as any;
    if (supabase) {
      const { data = [] } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${search}%`)
        .limit(6);
      const cards = (data as SupabaseProductRow[]).map(rowToCard);
      return { products: { nodes: cards } } as T;
    }
    const s = String(search).toLowerCase();
    const list = mockProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
      )
      .map(toCard)
      .slice(0, 6);
    return { products: { nodes: list } } as T;
  }

  if (op === 'getProduct') {
    const { slug, sku } = (variables || {}) as any;
    if (supabase) {
      let row: SupabaseProductRow | undefined;
      if (sku && /^\d+$/.test(String(sku))) {
        const { data = [] } = await supabase
          .from('products')
          .select('*')
          .eq('id', Number(sku))
          .limit(1);
        row = (data as SupabaseProductRow[])[0];
      } else {
        const pattern = String(slug || '').replace(/-/g, ' ');
        const { data = [] } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${pattern}%`)
          .limit(1);
        row = (data as SupabaseProductRow[])[0];
      }
      if (!row) throw new Error('Product not found');
      return { product: rowToDetail(row) } as T;
    }
    const product = findProductBySlug(slug);
    if (!product) throw new Error('Product not found');
    return { product } as T;
  }

  if (op === 'getCategories') {
    if (supabase) {
      const { data = [] } = await supabase.from('products').select('*');
      return toCategories(data as SupabaseProductRow[]) as T;
    }
    return mockCategories as T;
  }

  // Mutations
  if (op === 'addToCart') {
    const { input } = (variables || {}) as any;
    const variationId = input?.productId as number | undefined;
    const supabase = getSupabase();
    if (supabase) {
      if (!variationId) throw new Error('Invalid product');
      const { data = [] } = await supabase
        .from('products')
        .select('*')
        .eq('id', Number(variationId))
        .limit(1);
      const row = (data as SupabaseProductRow[])[0];
      if (!row) throw new Error('Product not found');
      const stock = Number((row as any).stock ?? 0);
      if (!Number.isFinite(stock) || stock <= 0)
        throw new Error('Insufficient stock');
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
      return { addToCart: { cartItem } } as T;
    }
    // Mock fallback
    const found = findVariationById(variationId);
    if (!found) throw new Error('Variation not found');
    const { product, variation } = found;
    const cartItem = {
      key: `mock-${variation.databaseId}`,
      quantity: 1,
      product: {
        node: {
          sku: product.sku,
          slug: product.slug,
          name: product.name,
        },
      },
      variation: {
        node: {
          name: `${product.name} ${variation.attributes.nodes
            .map((n) => n.value)
            .join('/')}`,
          databaseId: variation.databaseId,
          salePrice: variation.salePrice,
          regularPrice: variation.regularPrice,
          stockQuantity: variation.stockQuantity,
          stockStatus: variation.stockStatus,
          image: { sourceUrl: variation.image.sourceUrl },
        },
        attributes: variation.attributes.nodes.map((n) => ({ value: n.value })),
      },
    };
    return { addToCart: { cartItem } } as T;
  }

  if (op === 'updateItemQuantities') {
    const { input } = (variables || {}) as any;
    const items = (input?.items || []).map((i: any) => ({ key: i.key }));
    return { updateItemQuantities: { items } } as T;
  }

  if (op === 'Checkout') {
    // Fake order details
    const now = new Date();
    return {
      checkout: {
        order: {
          total: '$123.45',
          orderNumber: String(Math.floor(100000 + Math.random() * 900000)),
          date: now.toISOString(),
          paymentMethodTitle: 'Cash on Delivery',
        },
      },
    } as T;
  }

  throw new Error(`Mock resolver missing for operation: ${op || 'unknown'}`);
}
