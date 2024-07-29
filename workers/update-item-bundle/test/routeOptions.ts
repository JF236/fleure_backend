import { RouteOptions } from 'chanfana';
import { z } from 'zod';
import { Item } from '../src/item';

// Define the schema using zod
const requestSchema = z.object({
  bundle_id: z.number(),
  items: z.array(Item),
});

const responseSchema = z.object({
  series: z.object({
    success: z.boolean(),
    result: z.object({
      bundle_id: z.number(),
      items: z.array(Item),
    }),
  }),
});

export const routeOptions: RouteOptions = {
  router: null,
  raiseUnknownParameters: false,
};
