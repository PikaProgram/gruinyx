import Elysia from "elysia";
import { drizzlePlugin } from "@plugins/db.plugin";
import { createUserBodySchema } from "./user.schema";
import { UserService } from "./user.service";

export const userController = new Elysia({
  prefix: "/users",
}).use(drizzlePlugin());

userController.get("/", () => {
  return { message: "User route is working!" };
});

userController.post("/", async ({ body, db }) => {
  const newUser = await UserService.create(body, db);
  return newUser;
}, {
  body: createUserBodySchema,
});

