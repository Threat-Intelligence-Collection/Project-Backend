import { dbClient } from "@src/model/db/client";
import { UserService } from "@src/services/db_service/user/user.service";
import {
  userDTO,
  updateUserSchema,
  emailParamsDTO,
  UserRole,
} from "@src/dto/user.dto";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import { handleError } from "@src/services/handler/error_handling";
import { AppError } from "@src/services/handler/error_interface";

const userService = new UserService(dbClient);

type CreateUserDTO = typeof userDTO.static;
type UpdateUserDTO = typeof updateUserSchema.static;
type EmailParamsDTO = typeof emailParamsDTO.static;

export async function createUser({
  body,
}: {
  body: CreateUserDTO;
}): Promise<ApiResponse> {
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
      status: 201,
      message: "User created successfully",
      data: user,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      return handleError(error.statusCode, error.message);
    }
    return handleError(
      500,
      error instanceof Error
        ? `Internal Error: ${error.message}`
        : "Unknown internal error"
    );
  }
}

export async function getUserByEmail({
  params,
}: {
  params: EmailParamsDTO;
}): Promise<ApiResponse> {
  try {
    const user = await userService.getUserByEmail(params.email);
    return {
      success: true,
      status: 200,
      message: "User retrieved successfully",
      data: user,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      return handleError(error.statusCode, error.message);
    }
    return handleError(
      500,
      error instanceof Error
        ? `Internal Error: ${error.message}`
        : "Unknown internal error"
    );
  }
}

export async function deleteUser({
  params,
}: {
  params: EmailParamsDTO;
}): Promise<ApiResponse> {
  try {
    const user = await userService.deleteUser(params.email);
    return {
      success: true,
      status: 200,
      message: "User deleted successfully",
      data: user,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      return handleError(error.statusCode, error.message);
    }
    return handleError(
      500,
      error instanceof Error
        ? `Internal Error: ${error.message}`
        : "Unknown internal error"
    );
  }
}

export async function updateUser({
  body,
}: {
  body: UpdateUserDTO;
}): Promise<ApiResponse> {
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
      status: 200,
      message: "User updated successfully",
      data: user,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      return handleError(error.statusCode, error.message);
    }
    return handleError(
      500,
      error instanceof Error
        ? `Internal Error: ${error.message}`
        : "Unknown internal error"
    );
  }
}
