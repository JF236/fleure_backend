import { fromHono } from "chanfana";
import { Hono } from "hono";
import { AddItems } from "./endpoints/addItems";
import { RemoveItems } from "./endpoints/removeItems";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.post("/api/addItems", AddItems);
openapi.post("/api/removeItems", RemoveItems);

// Export the Hono app
export default app;
