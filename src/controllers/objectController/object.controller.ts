import { dbClient } from "@src/model/db/client";
import { ObjectService } from "@src/services/db_service/object/object.service";
import {
  objectDTO,
  eventIDParamsDTO,
  objectIDParamsDTO,
  updateObjectDTO,
} from "@src/dto/object.dto";

const objectService = new ObjectService(dbClient);

type CreateObjectDTO = typeof objectDTO.static;
type ObjectParamsDTO = typeof eventIDParamsDTO.static;
type ObjectIDParamsDTO = typeof objectIDParamsDTO.static;
type UpdateObjectDTO = typeof updateObjectDTO.static;

export async function createObject({ body }: { body: CreateObjectDTO }) {
  const { event_id, object_name, description } = body;
  try {
    const object = await objectService.createObject(
      event_id,
      object_name,
      description
    );
    return {
      success: true,
      message: "Object created successfully",
      data: object,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getObject({ params }: { params: ObjectParamsDTO }) {
  try {
    const object = await objectService.getObject(params.event_id);
    return {
      success: true,
      message: "Object retrieved successfully",
      data: object,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteObject({ params }: { params: ObjectIDParamsDTO }) {
  try {
    const object = await objectService.deleteObject(params.id);
    return {
      success: true,
      message: "Object deleted successfully",
      data: object,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateObject({ body }: { body: UpdateObjectDTO }) {
  const { id, event_id, object_name, description } = body;
  try {
    const object = await objectService.updateObject(
      id,
      event_id,
      object_name,
      description
    );
    return {
      success: true,
      message: "Object updated successfully",
      data: object,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
