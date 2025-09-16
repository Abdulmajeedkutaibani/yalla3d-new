// server/api/checkout.post.ts
export default defineEventHandler(async (event) => {
  const _body = await readBody(event);
  const now = new Date();
  return {
    checkout: {
      order: {
        total: '$0.00',
        orderNumber: String(Math.floor(100000 + Math.random() * 900000)),
        date: now.toISOString(),
        paymentMethodTitle: 'Cash on Delivery',
      },
    },
  };
});
