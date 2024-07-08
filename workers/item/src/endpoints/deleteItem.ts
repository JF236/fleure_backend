import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class DeleteItem extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Item"],
		summary: "Delete an item",
		parameters: {
			id: Path(Number, {
				description: "Item ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns if the item is no longer in the table",
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

		const { id } = data.params;

		const userQuery = await env.DB.prepare("DELETE FROM items WHERE id = ?")
			.bind( id );
	  	await userQuery.run();

	  	return new Response(
			JSON.stringify({
				success: true,
				result: "Item is no longer in the table",
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	}
}
