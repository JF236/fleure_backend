import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class CreateBookmark extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Bookmark"],
		summary: "Create a bookmark",
		parameters: {
			user_id: Path(Number, {
				description: "User ID",
			}),
			bundle_id: Path(Number, {
				description: "Bundle ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns if the bookmark was added successfully",
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

		const { user_id, bundle_id } = data.params;
	
		try {
		  const userQuery = await env.DB.prepare("INSERT INTO bookmarks (user_id, bundle_id) VALUES (?, ?)")
            .bind(user_id, bundle_id);
          const result = await userQuery.run();
	
		  return new Response(
			JSON.stringify({
			  success: true,
			  result: "Bookmark Inserted",
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
