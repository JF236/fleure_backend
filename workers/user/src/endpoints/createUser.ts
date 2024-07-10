import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class CreateUser extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["User"],
		summary: "Add an user",
		parameters: {
			username: Path(String, {
				description: "Username",
			}),
			email: Path(String, {
				description: "Email",
			}),
			password: Path(String, {
				description: "Password",
			}),
		},
		responses: {
			"200": {
				description: "Returns the user id if the user was added successfully",
				schema: {
					success: Boolean,
                    result: Number,
				},
			},
			"409": {
				description: "Returns if username or email exists",
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

		const { username, email, password } = data.params;

        var check = await env.DB.prepare("SELECT * FROM users WHERE username = ?")
            .bind(username)
          .first();

        if (check) {
            return new Response(
              JSON.stringify({
                  success: false,
                  error: "Username exists",
              }),
              { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }

        check = await env.DB.prepare("SELECT * FROM users WHERE email = ?")
            .bind(email)
          .first();

        if (check) {
            return new Response(
              JSON.stringify({
                  success: false,
                  error: "Email exists",
              }),
              { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }

		const userQuery = await env.DB.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
			.bind(username, email, password);
	  	await userQuery.run();

	  	const getIdQuery = await env.DB.prepare("SELECT id FROM users WHERE username = ? AND email = ? ORDER BY id DESC LIMIT 1")
            .bind(username, email);
        const result = await getIdQuery.first();

	  	return new Response(
			JSON.stringify({
				success: true,
				result: result.id,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	}
}
