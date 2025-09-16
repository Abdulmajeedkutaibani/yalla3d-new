// server/mock/data.ts

export type MockImage = { sourceUrl: string };

export type MockProductCard = {
  sku: string;
  slug: string;
  name: string;
  regularPrice: string;
  salePrice: string;
  allPaStyle: { nodes: { name: string }[] };
  image: MockImage;
  galleryImages: { nodes: MockImage[] };
};

export type MockVariation = {
  databaseId: number;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  stockQuantity: number;
  attributes: { nodes: { value: string }[] };
  image: MockImage;
  regularPrice: string;
  salePrice: string;
};

export type MockProductDetail = MockProductCard & {
  databaseId: number;
  description: string;
  allPaColor: { nodes: { name: string }[] };
  productTypes: {
    nodes: {
      products: {
        nodes: Array<
          Pick<MockProductCard, 'slug' | 'image'> & {
            allPaColor: { nodes: { name: string }[] };
          }
        >;
      };
    }[];
  };
  variations: { nodes: MockVariation[] };
  related: { nodes: MockProductCard[] };
  category: string;
};

export type MockCategoryNode = {
  id: string;
  name: string;
  image?: MockImage;
  products: { nodes: { id: string }[] };
  children: { nodes: MockCategoryNode[] };
};

// A small, representative catalog to drive the UI in mock mode
export const mockProducts: MockProductDetail[] = [
  {
    databaseId: 2001,
    sku: 'airmax-100',
    slug: 'air-max-90-red',
    name: 'Air Max 90 Red',
    regularPrice: '$120.00',
    salePrice: '$99.00',
    description:
      '<p>Classic Nike Air Max 90 in vibrant red. Lightweight cushioning and timeless style.</p>',
    allPaStyle: { nodes: [{ name: 'Sneakers' }] },
    allPaColor: { nodes: [{ name: 'Red' }] },
    image: { sourceUrl: 'https://picsum.photos/seed/airmax-red/800/800' },
    galleryImages: {
      nodes: [
        { sourceUrl: 'https://picsum.photos/seed/airmax-red-1/800/800' },
        { sourceUrl: 'https://picsum.photos/seed/airmax-red-2/800/800' },
      ],
    },
    productTypes: {
      nodes: [
        {
          products: {
            nodes: [
              {
                slug: 'air-max-90-blue',
                image: {
                  sourceUrl: 'https://picsum.photos/seed/airmax-blue/400/400',
                },
                allPaColor: { nodes: [{ name: 'Blue' }] },
              },
              {
                slug: 'air-max-90-black',
                image: {
                  sourceUrl: 'https://picsum.photos/seed/airmax-black/400/400',
                },
                allPaColor: { nodes: [{ name: 'Black' }] },
              },
            ],
          },
        },
      ],
    },
    variations: {
      nodes: [
        {
          databaseId: 1001,
          stockStatus: 'IN_STOCK',
          stockQuantity: 5,
          attributes: { nodes: [{ value: 'm' }] },
          image: {
            sourceUrl: 'https://picsum.photos/seed/airmax-red-var-m/300/300',
          },
          regularPrice: '$120.00',
          salePrice: '$99.00',
        },
        {
          databaseId: 1002,
          stockStatus: 'IN_STOCK',
          stockQuantity: 3,
          attributes: { nodes: [{ value: 'l' }] },
          image: {
            sourceUrl: 'https://picsum.photos/seed/airmax-red-var-l/300/300',
          },
          regularPrice: '$120.00',
          salePrice: '$99.00',
        },
        {
          databaseId: 1003,
          stockStatus: 'OUT_OF_STOCK',
          stockQuantity: 0,
          attributes: { nodes: [{ value: 'xl' }] },
          image: {
            sourceUrl: 'https://picsum.photos/seed/airmax-red-var-xl/300/300',
          },
          regularPrice: '$120.00',
          salePrice: '$99.00',
        },
      ],
    },
    related: {
      nodes: [
        {
          sku: 'airmax-101',
          slug: 'air-max-1',
          name: 'Air Max 1',
          regularPrice: '$130.00',
          salePrice: '$110.00',
          allPaStyle: { nodes: [{ name: 'Sneakers' }] },
          image: { sourceUrl: 'https://picsum.photos/seed/airmax1/800/800' },
          galleryImages: {
            nodes: [
              { sourceUrl: 'https://picsum.photos/seed/airmax1-g/800/800' },
            ],
          },
        },
        {
          sku: 'airmax-102',
          slug: 'air-max-95',
          name: 'Air Max 95',
          regularPrice: '$150.00',
          salePrice: '$150.00',
          allPaStyle: { nodes: [{ name: 'Sneakers' }] },
          image: { sourceUrl: 'https://picsum.photos/seed/airmax95/800/800' },
          galleryImages: {
            nodes: [
              { sourceUrl: 'https://picsum.photos/seed/airmax95-g/800/800' },
            ],
          },
        },
      ],
    },
    category: 'Shoes',
  },
  {
    databaseId: 2101,
    sku: 'tee-200',
    slug: 'premium-cotton-tee',
    name: 'Premium Cotton Tee',
    regularPrice: '$35.00',
    salePrice: '$29.00',
    description:
      '<p>Soft and breathable cotton t-shirt available in multiple sizes.</p>',
    allPaStyle: { nodes: [{ name: 'T-Shirt' }] },
    allPaColor: { nodes: [{ name: 'White' }] },
    image: { sourceUrl: 'https://picsum.photos/seed/tee-white/800/800' },
    galleryImages: {
      nodes: [
        { sourceUrl: 'https://picsum.photos/seed/tee-white-1/800/800' },
        { sourceUrl: 'https://picsum.photos/seed/tee-white-2/800/800' },
      ],
    },
    productTypes: {
      nodes: [
        {
          products: {
            nodes: [
              {
                slug: 'premium-cotton-tee-black',
                image: {
                  sourceUrl: 'https://picsum.photos/seed/tee-black/400/400',
                },
                allPaColor: { nodes: [{ name: 'Black' }] },
              },
            ],
          },
        },
      ],
    },
    variations: {
      nodes: [
        {
          databaseId: 1101,
          stockStatus: 'IN_STOCK',
          stockQuantity: 10,
          attributes: { nodes: [{ value: 's' }] },
          image: {
            sourceUrl: 'https://picsum.photos/seed/tee-white-s/300/300',
          },
          regularPrice: '$35.00',
          salePrice: '$29.00',
        },
        {
          databaseId: 1102,
          stockStatus: 'IN_STOCK',
          stockQuantity: 8,
          attributes: { nodes: [{ value: 'm' }] },
          image: {
            sourceUrl: 'https://picsum.photos/seed/tee-white-m/300/300',
          },
          regularPrice: '$35.00',
          salePrice: '$29.00',
        },
      ],
    },
    related: {
      nodes: [
        {
          sku: 'tee-201',
          slug: 'graphic-tee',
          name: 'Graphic Tee',
          regularPrice: '$25.00',
          salePrice: '$25.00',
          allPaStyle: { nodes: [{ name: 'T-Shirt' }] },
          image: {
            sourceUrl: 'https://picsum.photos/seed/tee-graphic/800/800',
          },
          galleryImages: {
            nodes: [
              { sourceUrl: 'https://picsum.photos/seed/tee-graphic-g/800/800' },
            ],
          },
        },
      ],
    },
    category: 'Apparel',
  },
  {
    databaseId: 2201,
    sku: 'hoodie-300',
    slug: 'cozy-hoodie',
    name: 'Cozy Hoodie',
    regularPrice: '$60.00',
    salePrice: '$49.00',
    description: '<p>Warm and comfy hoodie perfect for chilly days.</p>',
    allPaStyle: { nodes: [{ name: 'Hoodie' }] },
    allPaColor: { nodes: [{ name: 'Gray' }] },
    image: { sourceUrl: 'https://picsum.photos/seed/hoodie-gray/800/800' },
    galleryImages: {
      nodes: [
        { sourceUrl: 'https://picsum.photos/seed/hoodie-gray-1/800/800' },
        { sourceUrl: 'https://picsum.photos/seed/hoodie-gray-2/800/800' },
      ],
    },
    productTypes: { nodes: [{ products: { nodes: [] } }] },
    variations: {
      nodes: [
        {
          databaseId: 1201,
          stockStatus: 'IN_STOCK',
          stockQuantity: 4,
          attributes: { nodes: [{ value: 'l' }] },
          image: {
            sourceUrl: 'https://picsum.photos/seed/hoodie-gray-l/300/300',
          },
          regularPrice: '$60.00',
          salePrice: '$49.00',
        },
      ],
    },
    related: { nodes: [] },
    category: 'Apparel',
  },
];

export const mockCategories: {
  productCategories: { nodes: MockCategoryNode[] };
} = {
  productCategories: {
    nodes: [
      {
        id: 'c1',
        name: 'Shoes',
        image: { sourceUrl: 'https://picsum.photos/seed/cat-shoes/1200/800' },
        products: { nodes: [{ id: String(mockProducts[0].databaseId) }] },
        children: {
          nodes: [
            {
              id: 'c1-1',
              name: 'Sneakers',
              image: {
                sourceUrl: 'https://picsum.photos/seed/cat-sneakers/1200/800',
              },
              products: { nodes: [{ id: String(mockProducts[0].databaseId) }] },
              children: { nodes: [] },
            },
          ],
        },
      },
      {
        id: 'c2',
        name: 'Apparel',
        image: { sourceUrl: 'https://picsum.photos/seed/cat-apparel/1200/800' },
        products: { nodes: [{ id: String(mockProducts[1].databaseId) }] },
        children: {
          nodes: [
            {
              id: 'c2-1',
              name: 'T-Shirts',
              image: {
                sourceUrl: 'https://picsum.photos/seed/cat-tees/1200/800',
              },
              products: { nodes: [{ id: String(mockProducts[1].databaseId) }] },
              children: { nodes: [] },
            },
            {
              id: 'c2-2',
              name: 'Hoodies',
              image: {
                sourceUrl: 'https://picsum.photos/seed/cat-hoodies/1200/800',
              },
              products: { nodes: [{ id: String(mockProducts[2].databaseId) }] },
              children: { nodes: [] },
            },
          ],
        },
      },
    ],
  },
};

export function toCard(product: MockProductDetail): MockProductCard {
  const {
    sku,
    slug,
    name,
    regularPrice,
    salePrice,
    allPaStyle,
    image,
    galleryImages,
  } = product;
  return {
    sku,
    slug,
    name,
    regularPrice,
    salePrice,
    allPaStyle,
    image,
    galleryImages,
  };
}

export function findProductBySlug(
  slug?: string
): MockProductDetail | undefined {
  if (!slug) return undefined;
  return mockProducts.find((p) => p.slug === slug);
}

export function findVariationById(
  variationId?: number
): { product: MockProductDetail; variation: MockVariation } | undefined {
  if (!variationId) return undefined;
  for (const product of mockProducts) {
    const v = product.variations.nodes.find(
      (v) => v.databaseId === variationId
    );
    if (v) return { product, variation: v };
  }
  return undefined;
}
