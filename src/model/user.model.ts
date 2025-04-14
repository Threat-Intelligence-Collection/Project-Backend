import { users } from "@src/db/schema/user";
import { eq } from "drizzle-orm";
import { dbClient } from "@src/db/client";
import bcrypt from "bcrypt";

export class UserModel {
  constructor(private db: typeof dbClient) {}

  async createUser(
    user_name: string,
    email: string,
    password: string,
    user_role: string
  ) {
    if (!user_name || !email || !password || !user_role) {
      throw new Error("Missing required fields");
    }
    const existing = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existing.length > 0) {
      throw new Error(`User with ${email} already exists.`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.db
      .insert(users)
      .values({
        user_name,
        email,
        password: hashedPassword,
        user_role,
      })
      .returning();
    return newUser;
  }

  async getUserByEmail(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }
    const user = await this.db
      .select({
        id: users.id,
        user_name: users.user_name,
        email: users.email,
        user_role: users.user_role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.email, email));
    if (user.length === 0) {
      throw new Error(`User with ${email} not found`);
    }
    return user[0];
  }

  async deleteUser(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }
    const existing = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existing.length === 0) {
      throw new Error(`User with ${email} does not exist.`);
    }
    const deletedUser = await this.db
      .delete(users)
      .where(eq(users.email, email))
      .returning();
    return deletedUser;
  }
}
