import { dbClient } from "@src/db/client";
import { UserModel } from "@src/model/user.model";

const userModel = new UserModel(dbClient);

export interface CreateUserDTO {
    user_name: string;
    email: string;
    password: string;
    user_role: string;
}
  
export async function createUser({ body }: { body: CreateUserDTO }) {
    const { user_name, email, password, user_role } = body;
    try{
        const user = await userModel.createUser(user_name, email, password, user_role);
        return {
            success: true,
            user: user,
        }
    }catch (error : any) {
        return {
            success: false,
            message: error.message,
        }
    }
}
  