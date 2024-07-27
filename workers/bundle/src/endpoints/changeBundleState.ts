import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class ChangeBundleState extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Bundle"],
		summary: "Change Bundle State",
		parameters: {
			id: Path(Number, {
				description: "Bundle ID",
			}),
			state_id: Path(Number, {
				description: "Bundle State",
			}),
		},
		responses: {
			"200": {
				description: "Bundle state was updated (if id exists)",
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
		const { id, state_id } = data.params;


		try {
			const userQuery = env.DB.prepare("UPDATE bundles SET state_id = ? WHERE id = ?")
			.bind(state_id, id);
			const result = await userQuery.run();
	
			return new Response(
			JSON.stringify({
				success: true,
				result: "Bundle state changed (if ID exists)",
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
