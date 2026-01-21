import { accessTokenPlugin } from "@/plugin/provider/jwt.plugin";
import type { Elysia } from "elysia";
import { HTTPException } from "@/plugin/handler/error.handler";

export function authGuard(app: Elysia) {
  return app
    .use(accessTokenPlugin)
    .derive(async ({ headers: { authorization }, accessToken }) => {
      if (!authorization) {
        throw new HTTPException("No authorization header", "UNAUTHORIZED");
      }

      const token = authorization.split(" ")[1];
      const payload = await accessToken.verify(token);

      if (!payload) {
        throw new HTTPException("Invalid or expired access token", "UNAUTHORIZED");
      }

      const userId: string = payload.sub!;

      return { userId };
    });
}