import { dbClient } from "@src/model/db/client";
import { UserService } from "@src/services/db_service/user/user.service";
import { userDTO, updateUserSchema, emailParamsDTO, UserRole } from "@src/dto/user.dto";

const userService = new UserService(dbClient);

type CreateUserDTO = typeof userDTO.static;
type UpdateUserDTO = typeof updateUserSchema.static;
type EmailParamsDTO = typeof emailParamsDTO.static;

export async function createUser({ body }: { body: CreateUserDTO }) {
  const { user_name, email, password, user_role } = body;
  try {
    const user = await userService.createUser(
      user_name,
      email,
      password,
      user_role as UserRole
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
  params: EmailParamsDTO }
) {
  try {
    const user = await userService.getUserByEmail(params.email);
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

export async function deleteUser({ params }: { params: EmailParamsDTO }) {
  try {
    const user = await userService.deleteUser(params.email);
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

export async function updateUser({ body }: { body: UpdateUserDTO }) {
  const { id, user_name, email, password, user_role } = body;
  try {
    const user = await userService.updateUser(
      id,
      user_name,
      email,
      password,
      user_role as UserRole
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
