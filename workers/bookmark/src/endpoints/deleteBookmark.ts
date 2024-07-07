import {
	OpenAPIRoute,
	OpenAPIRouteSchema,
	Path,
} from "@cloudflare/itty-router-openapi";
import { Task } from "../types";

export class DeleteBookmark extends OpenAPIRoute {
	constructor() {
		super(null);
	}
    
	static schema: OpenAPIRouteSchema = {
		tags: ["Bookmark"],
		summary: "Delete a Bookmark",
		parameters: {
			user_id: Path(Number, {
				description: "User ID",
			}),
			bundle_id: Path(Number, {
				description: "Bundle ID",
			}),
		},
		responses: {
			"200": {
				description: "Returns if the Bookmark was deleted successfully or it never was there to begin with",
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
		// Retrieve the validated slug
		const { user_id, bundle_id } = data.params;

		// Implement your own object deletion here
        const userQuery = await env.DB.prepare(`DELETE FROM bookmarks WHERE user_id = ? AND bundle_id = ?`)
            .bind(user_id, bundle_id);
        const result = await userQuery.run();
  
        return new Response(
          JSON.stringify({
            success: true,
            result: "Bookmark does not exist",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
	}
}
