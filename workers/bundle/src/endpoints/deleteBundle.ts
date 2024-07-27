import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class DeleteBundle extends OpenAPIRoute {
	constructor() {
		super(null);
	}
	
	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle"],
		summary: "Delete a bundle",

		parameters: {
			id: Path(Number, {
				description: "Bundle Id",
			}),
		},
		responses: {
			"200": {
				description: "Returns true on successful deletion",
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
	)  {

		// Retrieve the validated request body
		const { id } = data.params;

		// Implement your own object insertion here
		try {
			const userQuery = await env.DB.prepare(`DELETE FROM bundles WHERE id = ?`)
			  .bind(id);
			const result = await userQuery.run();
	  
			return new Response(
			  JSON.stringify({
				success: true,
				result: "Bundle Deleted",
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
