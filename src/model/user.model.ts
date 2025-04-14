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

  async updateUser(
    id: number,
    user_name?: string,
    email?: string,
    password?: string,
    user_role?: string
  ) {
    if (!id) {
      throw new Error("ID is required");
    }

    const existing = await this.db.select().from(users).where(eq(users.id, id));
    if (existing.length === 0) {
      throw new Error(`User with ID ${id} does not exist.`);
    }

    const current = existing[0];

    const updateData: Partial<typeof users.$inferInsert> = {};

    if (!user_name) {
      updateData.user_name = current.user_name;
    } else {
      updateData.user_name = user_name;
    }
    if (!email) {
      updateData.email = current.email;
    } else {
      updateData.email = email;
    }
    if (!user_role) {
      updateData.user_role = current.user_role;
    } else {
      updateData.user_role = user_role;
    }
    if (!password) {
      updateData.password = current.password;
    } else {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields provided for update.");
    }

    const updatedUser = await this.db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }
}
