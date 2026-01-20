import Elysia from "elysia";
import { drizzlePlugin } from "@/plugin/provider/db.plugin";
import { createUserBodySchema, loginBodySchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { accessTokenPlugin, refreshTokenPlugin } from "@/plugin/provider/jwt.plugin";
import { env } from "@env";
import { authGuard } from "../../plugin/middleware/auth.guard";

export const authController = new Elysia({
  prefix: "/auth",
})
  .use(drizzlePlugin())
  .use(accessTokenPlugin)
  .use(refreshTokenPlugin);

authController.post("/login", async ({ body, db, accessToken, refreshToken, cookie: { refresh_token } }) => {
  const user = await AuthService.authenticateUser(body.email, body.password, db);

  if (!user) {
    return { error: "Invalid email or password" };
  }

  // Generate JWT token pair
  const tokens = await AuthService.generateTokenPair(
    user.id,
    accessToken,
    refreshToken
  );

  refresh_token!.set({
    value: tokens.refreshToken,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: 7 * 86400, // 7 days in seconds
  });

  return {
    accessToken: tokens.accessToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    }
  };
}, {
  body: loginBodySchema,
  detail: {
    description: "Authenticate a user and return user data",
    tags: ["Auth"],
  }
});

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

authController.get("/refresh", async ({ cookie: { refresh_token }, accessToken, refreshToken }) => {
  const token = refresh_token!.value;

  if (!token) {
    throw new Error("No refresh token");
  }

  const payload = await AuthService.validateRefreshToken(token as string, refreshToken);

  if (!payload) {
    throw new Error("Invalid or expired refresh token");
  }

  // Generate a new access token
  const newAccessToken = await accessToken.sign({ sub: String(payload.sub) });

  return {
    accessToken: newAccessToken,
  };
}, {
  detail: {
    description: "Refresh access token",
    tags: ["Auth"],
  }
});

authController.post("/logout", ({ cookie: { refresh_token } }) => {
  refresh_token!.remove();
  return { success: true };
}, {
  detail: {
    description: "Logout user",
    tags: ["Auth"],
  }
});

authController
  .use(authGuard)
  .get("/me", async ({ userId, db }) => {
    const user = await AuthService.getUser({ id: String(userId) }, db);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username
    };
  }, {
    detail: {
      description: "Get current authenticated user",
      tags: ["Auth"],
    },
  });

