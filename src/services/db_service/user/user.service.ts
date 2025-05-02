import { users } from "@src/model/db/schema/user";
import { eq } from "drizzle-orm";
import { dbClient } from "@src/model/db/client";
import bcrypt from "bcrypt";
import { UserRole } from "@src/dto/user.dto";

export class UserService {
  constructor(private db: typeof dbClient) {}

  async createUser(
    user_name: string,
    email: string,
    password: string,
    user_role: UserRole
  ) {
    return await this.db.transaction(async (tx) => {
      const existing = await tx.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (existing) {
        throw new Error(`User with ${email} already exists.`);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await tx
        .insert(users)
        .values({
          user_name,
          email,
          password: hashedPassword,
          user_role,
        })
        .returning();
      const { password: _, ...userWithoutPassword } = newUser[0];
      return userWithoutPassword;
    });
  }

  async getUserByEmail(email: string) {
    return await this.db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        where: eq(users.email, email),
        with: {
          events: true,
        },
      });
      if (!user) {
        throw new Error(`User with ${email} not found`);
      }
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async deleteUser(email: string) {
    return await this.db.transaction(async (tx) => {
      const existing = await tx.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!existing) {
        throw new Error(`User with ${email} does not exist.`);
      }
      const deletedUser = await tx
        .delete(users)
        .where(eq(users.email, email))
        .returning();
      const { password: _, ...userWithoutPassword } = deletedUser[0];
      return userWithoutPassword;
    });
  }

  async updateUser(
    id: string,
    user_name?: string,
    email?: string,
    password?: string,
    user_role?: UserRole
  ) {
    return await this.db.transaction(async (tx) => {
      const userId = Number(id);
      const existing = await tx.query.users.findFirst({
        where: eq(users.id, userId),
      });
      if (!existing) {
        throw new Error(`User with ${email} does not exist.`);
      }
      const current = existing;
      const updateData: Partial<typeof users.$inferInsert> = {};

      updateData.user_name = user_name ? user_name : current.user_name;
      updateData.email = email ? email : current.email;
      updateData.user_role = user_role ? user_role : current.user_role;
      updateData.password = password
        ? await bcrypt.hash(password, 10)
        : current.password;

      if (Object.keys(updateData).length === 0) {
        throw new Error("No fields provided for update.");
      }

      const updatedUser = await tx
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning();

      return updatedUser;
    });
  }
}
