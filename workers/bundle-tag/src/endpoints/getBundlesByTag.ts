import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class GetBundlesByTag extends OpenAPIRoute {
	constructor() {
		super(null);
	}
    
	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle-Tag"],
		summary: "Returns the list of bundles that have a tag",
		parameters: {
			tag_id: Path(Number, {
				description: "Tag ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the list of bundles that have the given tag",
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
		const { tag_id } = data.params;

        const results = await env.DB.prepare("SELECT bundle_id FROM bundle_tags WHERE tag_id = ?")
            .bind(tag_id)
            .all();
  
        return new Response(
            JSON.stringify({
                result: results,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
	}
}
