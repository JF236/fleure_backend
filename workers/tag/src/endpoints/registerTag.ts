import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class RegisterTag extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Tag"],
		summary: "Create a message entry",
		parameters: {
			tag_name: Path(String, {
				description: "Tag Name",
			}),
		},
		responses: {
			"200": {
				description: "Returns the tag id if the tag was registered successfully",
				schema: {
					success: Boolean,
                    result: Number,
				},
			},
			"409": {
				description: "The tag exists, returns the tag id",
				schema: {
					success: Boolean,
                    error: Number,
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

		const { tag_name } = data.params;

		const check = await env.DB.prepare("SELECT id FROM tags WHERE tag_name = ?")
		  .bind(tag_name)
		  .first();

		if (!check) {
			const userQuery = await env.DB.prepare("INSERT INTO tags (tag_name) VALUES (?)")
			  .bind(tag_name);
			await userQuery.run();
			const result = await env.DB.prepare("SELECT id FROM tags WHERE tag_name = ?")
			  .bind(tag_name)
			  .first();

			return new Response(
				JSON.stringify({
					success: true,
					result: result.id,
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			  );
		} 
		else {
			return new Response(
				JSON.stringify({
					success: false,
					error: check.id,
				}),
				{ status: 409, headers: { "Content-Type": "application/json" } }
			);
		}
	}
}
