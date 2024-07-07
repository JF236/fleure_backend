import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { CreateBundleTag } from "./endpoints/createBundleTag";
import { DeleteBundleTag } from "./endpoints/deleteBundleTag";
import { GetBundlesByTag } from "./endpoints/getBundlesByTag";
import { GetTagsByBundle } from "./endpoints/getTagsByBundle";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.post("/api/createBundleTag/bundle_id=:bundle_id/tag_id=:tag_id", CreateBundleTag);
router.delete("/api/deleteBundleTag/bundle_id=:bundle_id/tag_id=:tag_id", DeleteBundleTag);
router.get("/api/getBundlesByTag/tag_id=:tag_id", GetBundlesByTag);
router.get("/api/getTagsByBundle/bundle_id=:bundle_id", GetTagsByBundle);

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
