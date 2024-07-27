import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class ChangeBundleSize extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle"],
		summary: "Change Bundle Size",

		parameters: {
			id: Path(Number, {
				description: "Bundle ID",
				required: true,
			}),
			bundle_size: Path(Number, {
				description: "Bundle Size",
				required: true,
			}),
		},
		responses: {
			"200": {
				description: "Bundle size was updated (if id exists)",
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
		const { id, bundle_size } = data.params;


		try {
			const userQuery = env.DB.prepare("UPDATE bundles SET bundle_size = ? WHERE id = ?")
			.bind(bundle_size, id);
			const result = await userQuery.run();
	
			return new Response(
			JSON.stringify({
				success: true,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
			);
		}
		catch (error) {
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
