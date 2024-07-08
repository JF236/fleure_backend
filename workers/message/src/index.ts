import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { CreateMessage } from "./endpoints/createMessage";
import { GetIdByBundleBuyer } from "./endpoints/getIdByBundleBuyer";
import { GetIdsByBundle } from "./endpoints/getIdsByBundle";
import { GetIdsByBuyer } from "./endpoints/getIdsByBuyer";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.post("/api/createMessage/id=:id/bundle_id=:bundle_id/buyer_id=:buyer_id/", CreateMessage);
router.get("/api/getIdByBundleBuyer/bundle_id=:bundle_id/buyer_id=:buyer_id/", GetIdByBundleBuyer);
router.get("/api/getIdsByBundle/bundle_id=:bundle_id/", GetIdsByBundle);
router.get("/api/getIdsByBuyer/buyer_id=:buyer_id/", GetIdsByBuyer);

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
