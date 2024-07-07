import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { CreateBookmark } from "./endpoints/createBookmark";
import { DeleteBookmark } from "./endpoints/deleteBookmark";
import { GetBookmarksByUser } from "./endpoints/getBookmarksByUser";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.post("/api/createBookmark/user_id=:user_id/bundle_id=:bundle_id", CreateBookmark);
router.delete("/api/deleteBookmark/user_id=:user_id/bundle_id=:bundle_id", DeleteBookmark);
router.get("/api/getBookmarksByUser/user_id=:user_id", GetBookmarksByUser);

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
