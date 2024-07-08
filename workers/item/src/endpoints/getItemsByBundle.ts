import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class GetItemsByBundle extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Item"],
		summary: "Gets all the items in a bundle",
		parameters: {
			bundle_id: Path(Number, {
				description: "Bundle ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns the list of items",
				schema: {
					success: Boolean,
                    result: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                bundle_id: { type: "number" },
                                tag_name: { type: "string" },
                                image_id: { type: "number" },
                            },
                        },
                    },
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

		const { bundle_id } = data.params;
		
	  	const result = await env.DB.prepare("SELECT * FROM items WHERE bundle_id = ?")
		  	.bind(bundle_id)
			.all();

	  	return new Response(
			JSON.stringify({
				success: true,
				result: result,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	}
}
