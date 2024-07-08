import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { RegisterTag } from "./endpoints/registerTag";
import { GetAllTags } from "./endpoints/getAllTags";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.post("/api/registerTag/tag_name=:tag_name/", RegisterTag);
router.get("/api/getAllTags/", GetAllTags);

// 404 for everything else
router.all("*", () =>
	Response.json(
		{
			success: false,
			error: "Route not found",
		},
		{ status: 404 }
	)
);

export default {
	fetch: router.handle,
} satisfies ExportedHandler;
