import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class GetTagsByBundle extends OpenAPIRoute {
	constructor() {
		super(null);
	}
    
	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle-Tag"],
		summary: "Returns the list of tags that are on a bundle",
		parameters: {
			bundle_id: Path(Number, {
				description: "Bundle ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the list of tags on a bundle",
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

        const results = await env.DB.prepare("SELECT tag_id FROM bundle_tags WHERE bundle_id = ?")
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
