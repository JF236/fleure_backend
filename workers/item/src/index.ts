import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { AddItem } from "./endpoints/addItem";
import { DeleteItem } from "./endpoints/deleteItem";
import { GetItemsByBundle } from "./endpoints/getItemsByBundle";
import { UpdateItem } from "./endpoints/updateItem";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.post("/api/addItem/bundle_id=:bundle_id/item_name=:item_name/image_id=:image_id", AddItem);
router.delete("/api/deleteItem/id=:id/", DeleteItem);
router.get("/api/getItemsByBundle/bundle_id=:bundle_id/", GetItemsByBundle);
router.patch("/api/updateItem/id=:id/item_name=:item_name/image_id=:image_id/", UpdateItem);

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
