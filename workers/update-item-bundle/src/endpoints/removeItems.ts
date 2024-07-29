import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class RemoveItems extends OpenAPIRoute {
    
	schema = {
		tags: ["Bundle", "Item"],
		summary: "Remove items from bundle. Item only removed if bundle_id matches. Otherwise, nothing happens.",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
                            bundle_id: z.number(),
							item_ids: z.array(z.number()),
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
						schema: {
                            success: Boolean,
                            result: String,
                        },
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
		const { bundle_id, item_ids } = reqBody.body;


        try {
            // Check that bundle exists
            const result = await db.prepare(
                `SELECT * FROM bundles WHERE id = ?`
            ).bind(bundle_id)
            .first();
            if (!result) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        result: "Bundle does not exist",
                    }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }


            // Remove items from the database
            var count = 0
            for (const item_id of item_ids) {
                const deleteQuery = await db.prepare(
                    `DELETE FROM items WHERE id = ? AND bundle_id = ?`
                ).bind(item_id, bundle_id);
                await deleteQuery.run();
            }


            // Get number of items
            const checkQuery = await db.prepare(
                `SELECT COUNT(*) AS count FROM items WHERE bundle_id = ?`
                ).bind(bundle_id);
            const checkResult = await checkQuery.first();
            var size = 0
            if (typeof checkResult.count === 'number') {
                size = checkResult.count
            }

            // Update the bundle size
            const userQuery = await db.prepare(
                `UPDATE bundles
                SET bundle_size = ?
                WHERE id = ?;`
            ).bind( size, bundle_id );
            await userQuery.run();


            return new Response(
                JSON.stringify({
                    success: true,
                    result: "Items removed successfully.",
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
