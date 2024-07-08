import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class UpdatePassword extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["User"],
		summary: "Update a password",
		parameters: {
			id: Path(Number, {
				description: "User ID",
			}),
			password: Path(String, {
				description: "Password",
			}),
		},
		responses: {
			"200": {
				description: "Returns if the password was updated successfully",
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
		const { id, password } = data.params;

		const check = await env.DB.prepare("SELECT * FROM users WHERE id = ? ")
			.bind(id)
		  .first();

		if (check) {
			const userQuery = await env.DB.prepare("UPDATE users SET password = ? WHERE id = ?;")
				.bind( password, id );
			const result = await userQuery.run();

			return new Response(
			  JSON.stringify({
				  success: true,
				  result: "Password updated successfully",
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
