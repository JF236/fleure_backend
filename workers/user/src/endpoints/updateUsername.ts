import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class UpdateUsername extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["User"],
		summary: "Update a username",
		parameters: {
			id: Path(Number, {
				description: "User ID",
			}),
			username: Path(String, {
				description: "Username",
			}),
		},
		responses: {
			"200": {
				description: "Returns if the username was updated successfully",
				schema: {
					success: Boolean,
                    result: String,
				},
			},
			"409": {
				description: "User does not exist",
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
		const { id, username } = data.params;

		const check = await env.DB.prepare("SELECT * FROM users WHERE id = ? ")
			.bind(id)
		  .first();

		if (check) {
			const userQuery = await env.DB.prepare("UPDATE users SET username = ? WHERE id = ?;")
				.bind( username, id );
			const result = await userQuery.run();

			return new Response(
			  JSON.stringify({
				  success: true,
				  result: "Username updated successfully",
			  }),
			  { status: 200, headers: { "Content-Type": "application/json" } }
		  );
		}
		return new Response(
			JSON.stringify({
				success: false,
				error: "User does not exist",
			}),
			{ status: 409, headers: { "Content-Type": "application/json" } }
		);

	}
}
