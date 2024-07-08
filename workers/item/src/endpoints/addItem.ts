import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class AddItem extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Item"],
		summary: "Add an item",
		parameters: {
			bundle_id: Path(Number, {
				description: "Bundle ID",
			}),
			item_name: Path(String, {
				description: "Item Name",
			}),
			image_id: Path(Number, {
				description: "Image ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the item id if the item was added successfully",
				schema: {
					success: Boolean,
                    result: Number,
				},
			},
		},
	};

	async handle(
		request: Request,
		env: any,
		context: any,
		data: Record<string, any>
	) {

		const { bundle_id, item_name, image_id } = data.params;

		const userQuery = await env.DB.prepare("INSERT INTO items (bundle_id, item_name, image_id) VALUES (?, ?, ?)")
			.bind(bundle_id, item_name, image_id );
	  	await userQuery.run();

	  	const result = await env.DB.prepare("SELECT id FROM items WHERE bundle_id = ? AND item_name = ? AND image_id = ? ORDER BY id desc")
		  	.bind(bundle_id, item_name, image_id )
			.first();

	  	return new Response(
			JSON.stringify({
				success: true,
				result: result.id,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	}
}
