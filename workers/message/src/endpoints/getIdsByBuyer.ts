import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class GetIdsByBuyer extends OpenAPIRoute {
	constructor() {
		super(null);
	}
    
	static schema: OpenAPIRouteSchema = {
		tags: ["Message"],
		summary: "Returns the list of messages that are on a buyer",
		parameters: {
			buyer_id: Path(Number, {
				description: "Buyer ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the list of messages on a buyer",
				schema: {
                    result: [Number],
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
		const { buyer_id } = data.params;

        const results = await env.DB.prepare("SELECT id FROM messages WHERE buyer_id = ?")
            .bind(buyer_id)
            .all();
  
        return new Response(
            JSON.stringify({
                result: results,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
	}
}
