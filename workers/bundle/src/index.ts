import { fromHono } from "chanfana";
import { Hono } from "hono";
import { CreateBundle } from "./endpoints/createBundle";
import { DeleteBundle } from "./endpoints/deleteBundle";
import { ChangeBundleState } from "./endpoints/changeBundleState";
import { ChangeBundleSize } from "./endpoints/changeBundleSize";
import { UpdateBundle } from "./endpoints/updateBundle";
import { ListBundles } from "./endpoints/listBundles";
import { open } from "fs";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.post("/api/createBundle", CreateBundle);
openapi.delete("/api/deleteBundle", DeleteBundle);
openapi.put("/api/changeBundleState", ChangeBundleState);
openapi.put("/api/changeBundleSize", ChangeBundleSize);
openapi.post("/api/updateBundle", UpdateBundle);
openapi.get("/api/listBundles", ListBundles);

// Export the Hono app
export default app;
