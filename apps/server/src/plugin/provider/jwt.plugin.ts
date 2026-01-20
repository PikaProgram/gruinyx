import { jwt } from "@elysiajs/jwt";
import { env } from "@env";

export const accessTokenPlugin = jwt({
  name: "accessToken",
  secret: env.JWT_ACCESS_SECRET,
  exp: env.ACCESS_TOKEN_EXPIRY,
});

export const refreshTokenPlugin = jwt({
  name: "refreshToken",
  secret: env.JWT_REFRESH_SECRET,
  exp: env.REFRESH_TOKEN_EXPIRY,
});

// Export inferred types for usage in Service
export type AccessTokenPlugin = typeof accessTokenPlugin['decorator']['accessToken'];
export type RefreshTokenPlugin = typeof refreshTokenPlugin['decorator']['refreshToken'];