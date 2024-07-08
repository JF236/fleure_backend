import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class UpdateItem extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Item"],
		summary: "Update an item",
		parameters: {
			id: Path(Number, {
				description: "Item ID",
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
				description: "Returns if the item was updated successfully",
				schema: {
					success: Boolean,
                    result: String,
				},
			},
			"409": {
				description: "Item does not exist",
				schema: {
					success: Boolean,
                    error: String,
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
		const { id, item_name, image_id } = data.params;

		const check = await env.DB.prepare("SELECT * FROM items WHERE id = ? ")
			.bind(id)
		  .first();

		if (check) {
			const userQuery = await env.DB.prepare("UPDATE items SET item_name = ?, image_id = ? WHERE id = ?;")
				.bind( item_name, image_id, id );
			const result = await userQuery.run();

			return new Response(
			  JSON.stringify({
				  success: true,
				  result: "Item updated successfully",
			  }),
			  { status: 200, headers: { "Content-Type": "application/json" } }
		  );
		}
		return new Response(
			JSON.stringify({
				success: false,
				error: "Item does not exist",
			}),
			{ status: 409, headers: { "Content-Type": "application/json" } }
		);

	}
}
