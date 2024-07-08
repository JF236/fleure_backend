import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class GetIdsByBundle extends OpenAPIRoute {
	constructor() {
		super(null);
	}
    
	static schema: OpenAPIRouteSchema = {
		tags: ["Message"],
		summary: "Returns the list of messages that are on a bundle",
		parameters: {
			bundle_id: Path(Number, {
				description: "Bundle ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the list of messages on a bundle",
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
		const { bundle_id } = data.params;

        const results = await env.DB.prepare("SELECT id FROM messages WHERE bundle_id = ?")
            .bind(bundle_id)
            .all();
  
        return new Response(
            JSON.stringify({
                result: results,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
	}
}
