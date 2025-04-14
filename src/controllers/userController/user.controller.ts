import { dbClient } from "@src/db/client";
import { UserModel } from "@src/model/user.model";
import { userDTO } from "@src/dto/userDTO";

const userModel = new UserModel(dbClient);

export async function createUser({ body }: { body: typeof userDTO }) {
  const { user_name, email, password, user_role } = body;
  try {
    const user = await userModel.createUser(
      user_name,
      email,
      password,
      user_role
    );
    return {
      success: true,
      message: "User created successfully",
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getUserByEmail({
  params,
}: {
  params: { email: string };
}) {
  try {
    const user = await userModel.getUserByEmail(params.email);
    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteUser({
  params,
}: {
  params: { email: string };
}) {
  try {
    const user = await userModel.deleteUser(params.email);
    return {
      success: true,
      message: "User deleted successfully",
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateUser({ body }: { body: typeof userDTO }) {
  const { id, user_name, email, password, user_role } = body;
  try {
    const user = await userModel.updateUser(
      id,
      user_name,
      email,
      password,
      user_role
    );
    return {
      success: true,
      message: "User updated successfully",
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
