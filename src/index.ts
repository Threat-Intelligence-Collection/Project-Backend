import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { connectToDatabase } from "@db/util";

const app = new Elysia().use(cors());
app.use(
  swagger({
    documentation: {
      tags: [
        { name: "App", description: "General endpoints" },
        { name: "Auth", description: "Authentication endpoints" },
      ],
    },
  })
);
app.get("/hello", () => "Hello Elysia", {
  detail: {
    tags: ["App"],
  },
});

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
