import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class GetIdByBundleBuyer extends OpenAPIRoute {
	constructor() {
		super(null);
	}
    
	static schema: OpenAPIRouteSchema = {
		tags: ["Message"],
		summary: "Returns the message id of a certain bundle and buyer",
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
				description: "Returns the message id",
				schema: {
                    result: Number
				},
			},
			"404": {
				description: "No message id between the bundle and buyer",
				schema: {
                    error: String
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

        const result = await env.DB.prepare("SELECT id FROM messages WHERE bundle_id = ? AND buyer_id = ?")
            .bind(bundle_id, buyer_id)
            .first();

		if (!result) {
			return new Response(
				JSON.stringify({
					error: "Message not found",
				}),
				{ status: 404, headers: { "Content-Type": "application/json" } }
			);
		}
  
        return new Response(
            JSON.stringify({
                result: result.id,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
	}
}
