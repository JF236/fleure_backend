import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class CreateBundle extends OpenAPIRoute {
	constructor() {
		super(null);
	}
	
	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle"],
		summary: "Create a new Bundle",

		parameters: {
			user_id: Path(Number, {
				description: "User ID",
			}),
			bundle_name: Path(String, {
				description: "Bundle name",
			}),
			bundle_desc: Path(String, {
				description: "Bundle description",
			}),
			category_id: Path(Number, {
				description: "Category ID",
			}),
			bundle_size: Path(Number, {
				description: "Bundle Size",
			}),
			image_id: Path(Number, {
				description: "Image ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the created task",
				schema: {
					success: Boolean,
					result: Number,
						
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
		const { user_id, bundle_name, bundle_desc, category_id, bundle_size, image_id } = data.params;

		const userQuery = await env.DB.prepare(
			`INSERT INTO bundles (user_id, bundle_name, 
			bundle_desc, category_id, state_id, bundle_size, 
			creation_date, updated_date, image_id) 
			VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?)`)
		  .bind(user_id, bundle_name, bundle_desc, category_id, bundle_size, Date.now(), Date.now(), image_id);
		await userQuery.run();


		const result = await env.DB.prepare(`SELECT id FROM bundles WHERE user_id = ? AND bundle_name = ? AND bundle_desc = ? 
			AND state_id = 1 AND bundle_size = ? ORDER BY id desc`)
		.bind(user_id, bundle_name, bundle_desc, bundle_size )
		.first();

		return new Response(
		JSON.stringify({
			success: true,
			result: result.id,
		}),
		{ status: 200, headers: { "Content-Type": "application/json" } }
		);

	}
}
