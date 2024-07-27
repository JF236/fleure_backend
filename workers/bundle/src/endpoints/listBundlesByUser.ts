import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class ListBundlesByUser extends OpenAPIRoute {
	constructor() {
		super(null);
	}
	
	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle"],
		summary: "List bundles belonging to a specified user",

		parameters: {
			user_id: Path(Number, {
				description: "User ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the list of bundles",
				schema: {
					success: Boolean,
                    result: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
								id: {type: "number"},
                                user_id: { type: "number" },
                                bundle_name: { type: "string" },
                                bundle_desc: { type: "string" },
								category_id: { type: "number" },
								state_id: { type: "number" },
								bundle_size: { type: "number" },
								creation_date: { type: "number" },
								updated_date: { type: "number" },
                                image_id: { type: "number" },
                            },
                        },
                    },
						
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
	)  {

		// Retrieve the validated request body
		const { user_id } = data.params;

		// Implement your own object insertion here
		try {
			const result = await env.DB.prepare(`SELECT * FROM bundles WHERE user_id = ?`)
			  .bind(user_id)
			  .all();
	  
			return new Response(
			  JSON.stringify({
				success: true,
				result: result.results,
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
