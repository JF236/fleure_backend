import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class CreateBundleTag extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle-Tag"],
		summary: "Create a bundle-tag",
		parameters: {
			bundle_id: Path(Number, {
				description: "Bundle ID",
			}),
			tag_id: Path(Number, {
				description: "Tag ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns if the bundle-tag was added successfully",
				schema: {
					success: Boolean,
                    result: String,
				},
			},
			"409": {
				description: "Conflict Error",
				schema: {
					success: Boolean,
                    result: String,
				},
			},
			"500": {
				description: "Internal Server Error",
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

		const { bundle_id, tag_id } = data.params;
	
		try {
		  const userQuery = await env.DB.prepare("INSERT INTO bundle_tags (bundle_id, tag_id) VALUES (?, ?)")
            .bind(bundle_id, tag_id);
          const result = await userQuery.run();
	
		  return new Response(
			JSON.stringify({
			  success: true,
			  result: "Bundle-Tag Inserted",
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		  );

		} catch (error) {
			return new Response(
				JSON.stringify({
				success: false,
				error: String(error),
				}),
				{ status: 500, headers: { "Content-Type": "application/json" } }
			);
		}
	}
}
