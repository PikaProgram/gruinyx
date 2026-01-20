import { accessTokenPlugin } from "@/plugin/provider/jwt.plugin";
import type { Elysia } from "elysia";

export function authGuard(app: Elysia) {
  return app
    .use(accessTokenPlugin)
    .derive(async ({ headers: { authorization }, accessToken }) => {
      if (!authorization) {
        throw new Error("Unauthorized");
      }

      const token = authorization.split(" ")[1];
      const payload = await accessToken.verify(token);

      if (!payload) {
        throw new Error("Unauthorized");
      }

      const userId: string = payload.sub!;

      return { userId };
    });
}