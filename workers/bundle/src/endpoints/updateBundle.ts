import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class UpdateBundle extends OpenAPIRoute {
	constructor() {
		super(null);
	}
	
	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle"],
		summary: "Update Bundle",

		parameters: {
			id: Path(Number, {
				description: "Bundle Id",
			}),
			bundle_name: Path(String, {
				description: "Bundle name",
			}),
			bundle_desc: Path(String, {
				description: "Bundle description",
			}),
			category_id: Path(String, {
				description: "Bundle category",
			}),
			image_id: Path(String, {
				description: "Bundle image",
			}),
		},
		responses: {
			"200": {
				description: "Returns true if successful",
				schema: {
					success: Boolean,
					result: String,
						
				},
			},
			"409": {
				description: "Bundle does not exist",
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
		const { id, bundle_name, bundle_desc, category_id, image_id } = data.params;
	
		const check = await env.DB.prepare("SELECT * FROM bundles WHERE id = ? ")
			.bind(id)
		  .first();

		if (check) {
			const userQuery = await env.DB.prepare("UPDATE bundles SET bundle_name = ?, bundle_desc = ?, category_id = ?, image_id = ? WHERE id = ?")
				.bind( bundle_name, bundle_desc, category_id, image_id, id );
			await userQuery.run();

			return new Response(
			  JSON.stringify({
				  success: true,
				  result: "Bundle updated successfully",
			  }),
			  { status: 200, headers: { "Content-Type": "application/json" } }
		  );
		}
		return new Response(
			JSON.stringify({
				success: false,
				error: "Bundle does not exist",
			}),
			{ status: 409, headers: { "Content-Type": "application/json" } }
		);

	}
	
}
