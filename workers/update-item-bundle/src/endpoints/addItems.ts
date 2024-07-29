import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Item } from "../item";

export class AddItems extends OpenAPIRoute {
    
	schema = {
		tags: ["Bundle", "Item"],
		summary: "Add Items to Bundle",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
                            bundle_id: z.number(),
							items: z.array(Item),
						}),
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Returns the added items",
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
				description: "Bundle Does Not Exist",
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
		const { bundle_id, items } = reqBody.body;


        try {
            // Get past bundle size
            const result = await db.prepare(
                `SELECT bundle_size FROM bundles WHERE id = ?`
            ).bind(bundle_id)
            .first();

            var size = items.length;
            if (result && typeof result.bundle_size === 'number') {
                size += result.bundle_size;
            }
            else {
                return new Response(
                    JSON.stringify({
                        success: false,
                        result: "Bundle does not exist",
                    }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }

            // Update the bundle size
            const userQuery = await db.prepare(
                `UPDATE bundles
                SET bundle_size = ?
                WHERE id = ?;`
            ).bind( size, bundle_id );
            await userQuery.run();


            // Insert items into the database and collect their IDs
            for (const item of items) {
                const itemQuery = await db.prepare(
                    `INSERT INTO items (bundle_id, item_name, image_id) VALUES (?, ?, ?)`
                ).bind(bundle_id, item.item_name, item.image_id);
                await itemQuery.run();

                // Retrieve the newly inserted item ID
                const insertedItem = await db.prepare(
                    `SELECT id FROM items WHERE bundle_id = ? AND item_name = ? AND image_id = ? ORDER BY id DESC`
                ).bind(bundle_id, item.item_name, item.image_id)
                .first();

                if (typeof insertedItem.id === 'number') {
                    //item.id = insertedItem.id
                    item.bundle_id = bundle_id
                }
            }


            return new Response(
                JSON.stringify({
                    success: true,
                    result: {
                        bundle_id: bundle_id,
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
