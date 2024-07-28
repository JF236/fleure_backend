import { fromHono } from "chanfana";
import { Hono } from "hono";
import { CreateBundle } from "./endpoints/createBundle"

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.post("/api/createBundle", CreateBundle)

// Export the Hono app
export default app;
