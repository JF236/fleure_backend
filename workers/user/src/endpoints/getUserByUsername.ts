import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class GetUserByUsername extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["User"],
		summary: "Get a user by Username",
		parameters: {
			username: Path(String, {
				description: "Username",
			}),
		},
		responses: {
			"200": {
				description: "Returns a single user if found",
				schema: {
					success: Boolean,
					result: {
						id: Number,
						username: String,
						email: String,
					},
				},
			},
			"404": {
				description: "Task not found",
				schema: {
					success: Boolean,
					error: String,
				},
			},
			"500": {
				description: "Internal Server Error",
				schema: {
					success: Boolean,
					error: String,
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

		const { username } = data.params;
	
		try {
		  const userQuery = await env.DB.prepare("SELECT id, username, email FROM users WHERE username = ?")
		  	.bind(username)
			.first();
	
		  if (!userQuery) {
			return new Response(
			  JSON.stringify({
				success: false,
				error: "User not found",
			  }),
			  { status: 404, headers: { "Content-Type": "application/json" } }
			);
		  }
	
		  return new Response(
			JSON.stringify({
			  success: true,
			  result: userQuery,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		  );

		} catch (error) {
		  return new Response(
			JSON.stringify({
			  success: false,
			  error: "Internal Server Error: " + error,
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		  );
		}
	}
}
