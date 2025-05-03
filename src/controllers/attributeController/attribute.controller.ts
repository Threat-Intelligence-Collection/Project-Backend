import { dbClient } from "@src/model/db/client";
import { AttributeService } from "@src/services/db_service/attribute/attribute.service";
import {
  AttributeType,
  attributeDTO,
  attributeParamsDTO,
  updateAttributeDTO
} from "@src/dto/attribute.dto";

const attributeService = new AttributeService(dbClient);

type CreateAttributeDTO = typeof attributeDTO.static;
type GetAttributeByValueDTO = typeof attributeParamsDTO.static;
type DeleteAttributeByValueDTO = typeof attributeParamsDTO.static;
type UpdateAttributeDTO = typeof updateAttributeDTO.static;

export async function createAttribute({ body }: { body: CreateAttributeDTO }) {
  const { event_id, type, value, firstseen, lastseen } = body;
  try {
    const attribute = await attributeService.createAttribute(
      event_id,
      type as AttributeType,
      value,
      firstseen,
      lastseen
    );
    return {
      success: true,
      message: "Attribute created successfully",
      data: attribute,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getAttributeByValue({
  params,
}: {
  params: GetAttributeByValueDTO;
}) {
  try {
    const attribute = await attributeService.getAttributeByValue(params.value);
    return {
      success: true,
      message: "Attribute retrieved successfully",
      data: attribute,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteAttributeByValue({
  params,
}: {
  params: DeleteAttributeByValueDTO;
}) {
  try {
    const result = await attributeService.deleteAttributeByValue(params.value);
    return {
      success: true,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateAttribute({ body }: { body: UpdateAttributeDTO }) {
  const { value, event_id, type, firstseen, lastseen } = body;
  try {
    const attribute = await attributeService.updateAttribute(
      value,
      event_id,
      type as AttributeType,
      firstseen ?? undefined,
      lastseen ?? undefined
    );
    return {
      success: true,
      message: "Attribute updated successfully",
      data: attribute,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
