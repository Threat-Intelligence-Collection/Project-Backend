import { users } from "@src/db/schema/user";
import { eq } from "drizzle-orm";
import { dbClient } from "@src/db/client";

export class UserModel {
    constructor(private db: typeof dbClient) {}

    async createUser(user_name: string, email: string, password: string, user_role: string) {
        const existing = await this.db.select().from(users).where(eq(users.email, email));
        if (existing.length > 0) {
            throw new Error("User already exists with this email");
        }
        const newUser = await this.db.insert(users).values({
            user_name,
            email,
            password,
            user_role,
        });
        return newUser;
    }
}