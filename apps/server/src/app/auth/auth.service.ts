import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import type { CreateUserBody, SelectUserParams } from "./auth.schema";
import { userTable, type Table } from "@database/schemas";
import { eq } from "drizzle-orm";
import type { AccessTokenPlugin, RefreshTokenPlugin } from "@plugins/provider/jwt.plugin";

export abstract class AuthService {
  static async getUser(userQuery: SelectUserParams, db: NeonDatabase<Table>) {
    if (!userQuery.id && !userQuery.email && !userQuery.username) {
      throw new Error("At least one query parameter (id, email, or username) must be provided.");
    };

    const [user] = await db
      .select()
      .from(userTable)
      .where(
        userQuery.username ? eq(userTable.username, userQuery.username) :
          userQuery.email ? eq(userTable.email, userQuery.email) :
            eq(userTable.id, userQuery.id!))
      .limit(1);
    return user;
  }

  static async createUser(userData: CreateUserBody, db: NeonDatabase<Table>) {
    try {
      if (await this.getUser({ email: userData.email }, db)) {
        throw new Error("User with this email already exists.");
      }

      const [newUser] = await db
        .insert(userTable)
        .values({
          username: userData.username,
          password: await Bun.password.hash(userData.password, { algorithm: 'bcrypt' }),
          email: userData.email,
        })
        .returning();

      return newUser;
    }
    catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async authenticateUser(email: string, password: string, db: NeonDatabase<Table>) {
    
    
    const user = await this.getUser({ email }, db);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await Bun.password.verify(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  static async generateTokenPair(userId: string, accessTokenPlugin: AccessTokenPlugin, refreshTokenPlugin: RefreshTokenPlugin) {
    const accessToken = await accessTokenPlugin.sign({ sub: userId });
    const refreshToken = await refreshTokenPlugin.sign({ sub: userId });

    return {
      accessToken,
      refreshToken,
    };
  }

  static async validateAccessToken(token: string, accessTokenPlugin: AccessTokenPlugin) {
    try {
      const payload = await accessTokenPlugin.verify(token);
      return payload;
    } catch {
      return null;
    }
  }

  static async validateRefreshToken(token: string, refreshTokenPlugin: RefreshTokenPlugin) {
    try {
      const payload = await refreshTokenPlugin.verify(token);
      return payload;
    } catch {
      return null;
    }
  }
}