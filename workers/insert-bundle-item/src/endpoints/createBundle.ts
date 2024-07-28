import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Item, ItemType } from "../item";

export class CreateBundle extends OpenAPIRoute {
	constructor() {
		super(null);
	}
    
	schema = {
		tags: ["Bundle", "Item"],
		summary: "Create a new Bundle and Items",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
                            user_id: z.number(),
                            bundle_name: z.string(),
                            bundle_desc: z.string(),
                            category_id: z.number(),
                            bundle_size: z.number(),
                            image_id: z.number(),
							items: z.array(Item),
						}),
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Returns the created items",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								result: z.object({
                                    bundle_id: z.number(),
									items: z.array(Item),
								}),
							}),
						}),
					},
				},
			},
            "400": {
                description: "Bad Request - Items array length does not match bundle size",
                schema: {
                    success: Boolean,
                    result: String,
                },
            },
			"500": {
				description: "Internal Server Error",
				schema: {
					success: Boolean,
                    result: String,
				},
			},
		},
	};

    async handle(c) {
        const db = c.env.DB as D1Database;
        
		const reqBody = await this.getValidatedData<typeof this.schema>();
		const { user_id, bundle_name, bundle_desc, category_id, bundle_size, image_id, items } = reqBody.body;


        try {
            if (items.length !== bundle_size) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        result: "Items array length does not match bundle size.",
                    }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }


            // Insert the bundle into the database
            const userQuery = await db.prepare(
                `INSERT INTO bundles (user_id, bundle_name, 
                bundle_desc, category_id, state_id, bundle_size, 
                creation_date, updated_date, image_id) 
                VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?)`
            ).bind(user_id, bundle_name, bundle_desc, category_id, bundle_size, Date.now(), Date.now(), image_id);
            await userQuery.run();

            // Retrieve the newly created bundle ID
            const result = await db.prepare(
                `SELECT id FROM bundles WHERE user_id = ? AND bundle_name = ? AND bundle_desc = ? 
                AND state_id = 1 AND bundle_size = ? ORDER BY id DESC`
            ).bind(user_id, bundle_name, bundle_desc, bundle_size)
            .first();

            const bundleId = result.id;
            const itemIds: number[] = [];

            // Insert items into the database and collect their IDs
            for (const item of items) {
                const itemQuery = await db.prepare(
                    `INSERT INTO items (bundle_id, item_name, image_id) VALUES (?, ?, ?)`
                ).bind(bundleId, item.item_name, item.image_id);
                await itemQuery.run();

                // Retrieve the newly inserted item ID
                const insertedItem = await db.prepare(
                    `SELECT id FROM items WHERE bundle_id = ? AND item_name = ? AND image_id = ? ORDER BY id DESC`
                ).bind(bundleId, item.item_name, item.image_id)
                .first();

                if (insertedItem && typeof insertedItem.id === 'number' && typeof bundleId === 'number') {
                    item.id = insertedItem.id
                    item.bundle_id = bundleId
                }
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    result: {
                        bundleId: bundleId,
                        items: items,
                    },
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        } catch (error) {
            return new Response(
                JSON.stringify({
                    success: false,
                    result: "Database error: " + error,
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
	}
}
