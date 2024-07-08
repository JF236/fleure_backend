import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";

export class GetAllTags extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	static schema: OpenAPIRouteSchema = {
		tags: ["Tag"],
		summary: "Returns all the tags",
		parameters: {
		},
		responses: {
			"200": {
				description: "Returns the tag id if the tag was registered successfully",
				schema: {
					success: Boolean,
                    result: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                tag_name: { type: "string" },
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
        const tags = await env.DB.prepare("SELECT id, tag_name FROM tags")
            .all();
        return {
            json: { success: true, result: tags },
        };
	}
}
