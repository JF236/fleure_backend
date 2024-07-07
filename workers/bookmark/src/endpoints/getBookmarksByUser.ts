import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class GetBookmarksByUser extends OpenAPIRoute {
	constructor() {
		super(null);
	}
    
	static schema: OpenAPIRouteSchema = {
		tags: ["Bookmark"],
		summary: "Returns the list of bundles the user bookmarked",
		parameters: {
			user_id: Path(Number, {
				description: "User ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the list of bookmarked bundles",
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
		const { user_id } = data.params;

        const results = await env.DB.prepare("SELECT bundle_id FROM bookmarks WHERE user_id = ?")
            .bind(user_id)
            .all();
  
        return new Response(
            JSON.stringify({
                result: results,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
	}
}
