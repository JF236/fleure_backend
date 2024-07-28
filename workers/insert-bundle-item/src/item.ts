import { Str } from "chanfana";
import { z } from "zod";

export const Item = z.object({
	id: z.number().default(-1),
	bundle_id: z.number().default(-1),
	item_name: Str(),
    image_id: z.number().int(),
});

export type ItemType = z.infer<typeof Item>;