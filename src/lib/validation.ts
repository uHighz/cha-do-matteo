import { z } from 'zod';

export const idSchema = z.string().uuid();
export const itemsSchema = z.array(z.object({
  productId: z.string().min(1).max(80),
  delivery: z.enum(['bring', 'pay']),
})).min(1).max(2);
