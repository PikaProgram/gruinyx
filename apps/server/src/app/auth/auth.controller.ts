import Elysia from "elysia";
import { drizzlePlugin } from "@plugins/db.plugin";
import { createUserBodySchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export const authController = new Elysia({
  prefix: "/auth",
}).use(drizzlePlugin());

authController.post("/register", async ({ body, db }) => {
  const newUser = await AuthService.createUser(body, db);
  return newUser;
}, {
  body: createUserBodySchema,
  detail: {
    description: "Create a new user",
    tags: ["Auth"],
  }
});

