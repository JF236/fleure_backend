import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class DeleteBundleTag extends OpenAPIRoute {
	constructor() {
		super(null);
	}
    
	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle-Tag"],
		summary: "Delete a Bundle-Tag",
		parameters: {
			bundle_id: Path(Number, {
				description: "User ID",
			}),
			tag_id: Path(Number, {
				description: "Bundle ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns if the Bundle-Tag was deleted successfully or it never was there to begin with",
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
		// Retrieve the validated slug
		const { bundle_id, tag_id } = data.params;

		// Implement your own object deletion here
        const userQuery = await env.DB.prepare("DELETE FROM bundle_tags WHERE bundle_id = ? AND tag_id = ?")
            .bind(bundle_id, tag_id);
        const result = await userQuery.run();
  
        return new Response(
          JSON.stringify({
            success: true,
            result: "Bundle-tag does not exist",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
	}
}
