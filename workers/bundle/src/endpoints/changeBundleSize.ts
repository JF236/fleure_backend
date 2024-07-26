import { Bool, Num, OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class ChangeBundleSize extends OpenAPIRoute {
	constructor() {
		super(null);
	}

	schema = {
		tags: ["Bundle"],
		summary: "Change Bundle Size",
		request: {
			query: z.object({
				user_id: Num({
					description: "User ID",
				}),
				bundle_id: Num({
					description: "Bundle ID",
				}),
				size: Num({
					description: "New bundle size",
				}),
			}),
		},
		responses: {
			"200": {
				description: "Updated bundle size successfully",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								result: z.object({
									tasks: Task.array(),
								}),
							}),
						}),
					},
				},
			},
		},
	};

	async handle(c) {
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated parameters
		const { page, isCompleted } = data.query;

		// Implement your own object list here

		return {
			success: true,
			tasks: [
				{
					name: "Clean my room",
					slug: "clean-room",
					description: null,
					completed: false,
					due_date: "2025-01-05",
				},
				{
					name: "Build something awesome with Cloudflare Workers",
					slug: "cloudflare-workers",
					description: "Lorem Ipsum",
					completed: true,
					due_date: "2022-12-24",
				},
			],
		};
	}
}
