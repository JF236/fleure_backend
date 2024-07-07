import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { CreateBundleTag } from "./endpoints/createBundleTag";
import { DeleteBundleTag } from "./endpoints/deleteBundleTag";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.post("/api/createBundleTag/bundle_id=:bundle_id/tag_id=:tag_id", CreateBundleTag);
router.delete("/api/deleteBundleTag/bundle_id=:bundle_id/tag_id=:tag_id", DeleteBundleTag);

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
