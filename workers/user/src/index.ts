import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { CreateUser } from "./endpoints/createUser";
import { GetUserById } from "./endpoints/getUserById";
import { GetUserByUsername } from "./endpoints/getUserByUsername";
import { UpdatePassword } from "./endpoints/updatePassword";
import { UpdateUsername } from "./endpoints/updateUsername";

export const router = OpenAPIRouter({
	docs_url: "/",
});

router.post("/api/createUser/username=:username/email=:email/password=:password/", CreateUser);
router.get("/api/getUser/id=:id/", GetUserById);
router.get("/api/getUser/username=:username/", GetUserByUsername);
router.patch("/api/updateUserPassword/id=:id/password=:password/", UpdatePassword);
router.patch("/api/updateUserUsername/id=:id/username=:username", UpdateUsername);

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
