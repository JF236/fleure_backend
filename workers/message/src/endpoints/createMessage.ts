import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class CreateMessage extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Message"],
		summary: "Create a message entry",
		parameters: {
			bundle_id: Path(Number, {
				description: "Bundle ID",
			}),
			buyer_id: Path(Number, {
				description: "Buyer ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns if the message entry was added successfully",
				schema: {
					success: Boolean,
                    result: Number,
				},
			},
			"404": {
				description: "Message between bundle-buyer exists",
				schema: {
					success: Boolean,
                    result: String,
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

		const { bundle_id, buyer_id } = data.params;

		const check = await env.DB.prepare("SELECT id FROM messages WHERE bundle_id = ? AND buyer_id = ?")
		  .bind(bundle_id, buyer_id)
		  .first();

		if (!check) {
			const userQuery = await env.DB.prepare("INSERT INTO messages (bundle_id, buyer_id) VALUES (?, ?)")
			  .bind(bundle_id, buyer_id);
			await userQuery.run();
			const result = await env.DB.prepare("SELECT id FROM messages WHERE bundle_id = ? AND buyer_id = ?")
			  .bind(bundle_id, buyer_id)
			  .first();

			return new Response(
				JSON.stringify({
					success: true,
					result: result.id,
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			  );
		} 
		else {
			return new Response(
				JSON.stringify({
				success: false,
				error: "Message between bundle-buyer exists",
				}),
				{ status: 404, headers: { "Content-Type": "application/json" } }
			);
		}
	}
}
