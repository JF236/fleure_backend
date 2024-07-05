import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { GetUserById } from "./endpoints/getUserById";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.get("/api/getUser/id=:id/", GetUserById);

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