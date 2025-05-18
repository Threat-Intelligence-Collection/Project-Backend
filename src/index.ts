import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { connectToDatabase } from "@src/model/db/util";
import { appRoutes } from "@routes/user.routes";
import { eventRoute } from "./routes/event.route";
import { objectRoute } from "./routes/object.route";
import { attributeRoutes } from "./routes/attribute.route";
import { assetAttributeRoutes } from "./routes/asset_attribute.route";
import { tagRoute } from "./routes/tag.route";

const app = new Elysia().use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app
  .use(
    swagger({
      documentation: {
        tags: [
          { name: "app", description: "App endpoints" },
          { name: "Search", description: "Search endpoints catagory" },
        ],
      },
    })
  )
  .use(appRoutes)
  .use(eventRoute)
  .use(objectRoute)
  .use(attributeRoutes)
  .use(tagRoute)
  .use(assetAttributeRoutes);

async function initializeServer() {
  try {
    await connectToDatabase();

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🦊 Elysia is running at ${app.server?.hostname}:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

initializeServer();
