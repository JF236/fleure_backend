
import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { CreateBundle } from "./endpoints/createBundle";
import { DeleteBundle } from "./endpoints/deleteBundle";
import { ChangeBundleState } from "./endpoints/changeBundleState";
import { ChangeBundleSize } from "./endpoints/changeBundleSize";
import { UpdateBundle } from "./endpoints/updateBundle";
import { ListBundlesByUser } from "./endpoints/listBundlesByUser";
import { ListBundlesByCategory } from "./endpoints/listBundlesByCategory";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.post("/api/createBundle/user_id=:user_id/bundle_name=:bundle_name/bundle_desc=:bundle_desc/category_id=:category_id/bundle_size=:bundle_size/image_id=:image_id", CreateBundle);
router.delete("/api/deleteBundle/id=:id", DeleteBundle);
router.patch("/api/changeBundleState/id=:id/state_id=:state_id", ChangeBundleState);
router.patch("/api/changeBundleSize/id=:id/bundle_size=:bundle_size", ChangeBundleSize);
router.patch("/api/updateBundle/id=:id/bundle_name=:bundle_name/bundle_desc=:bundle_desc/category_id=:category_id/image_id=:image_id", UpdateBundle);
router.get("/api/listBundlesByUser/user_id=:user_id", ListBundlesByUser);
router.get("/api/listBundlesByUser/category_id=:category_id", ListBundlesByCategory);

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

