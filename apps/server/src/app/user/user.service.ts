import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import type { CreateUserBody } from "./user.schema";
import { userTable, type Table } from "@database/schemas";

export abstract class UserService {
  static async create(userData: CreateUserBody, db: NeonDatabase<Table>) {
    try {
      const [newUser] = await db
        .insert(userTable)
        .values({
          username: userData.username,
          password: await Bun.password.hash(userData.password, {algorithm: 'bcrypt'}),
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
}