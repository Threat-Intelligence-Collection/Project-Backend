import { dbClient } from "@src/model/db/client";
import { AssetAttributeService } from "@src/services/db_service/asset_attribute/asset_attribute.service";
import {
  assetAttributeDTO,
  get_by_event_id,
  get_by_name,
  delete_by_name_version,
  update_by_id,
} from "@src/dto/asset_attribute.dto";

const assetAttributeService = new AssetAttributeService(dbClient);
type CreateAssetAttributeDTO = typeof assetAttributeDTO.static;
type GetAssetAttributeByEventIdDTO = typeof get_by_event_id.static;
type GetAssetAttributeByAssetNameDTO = typeof get_by_name.static;
type DeleteAssetAttributeByNameVersionDTO =
  typeof delete_by_name_version.static;
type UpdateAssetAttributeByIdDTO = typeof update_by_id.static;

export async function createAssetAttribute({
  body,
}: {
  body: CreateAssetAttributeDTO;
}) {
  const { event_id, asset_name, version, vendor, cpe, source, exp } = body;
  try {
    const assetAttribute = await assetAttributeService.createAssetAttribute(
      event_id,
      asset_name,
      version,
      vendor,
      cpe,
      source,
      exp
    );
    return {
      success: true,
      message: "Asset attribute created successfully",
      data: assetAttribute,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getAssetAttributesByEventId({
  params,
}: {
  params: GetAssetAttributeByEventIdDTO;
}) {
  const { event_id } = params;
  try {
    const assetAttributes =
      await assetAttributeService.getAssetAttributesByEventId(event_id);
    return {
      success: true,
      message: "Asset attributes retrieved successfully",
      data: assetAttributes,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getAssetAttributeByAssetName({
  params,
}: {
  params: GetAssetAttributeByAssetNameDTO;
}) {
  const { asset_name } = params;
  try {
    const assetAttribute =
      await assetAttributeService.getAssetAttributeByAssetName(asset_name);
    return {
      success: true,
      message: "Asset attribute retrieved successfully",
      data: assetAttribute,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteAssetAttributeByNameVersion({
  body,
}: {
  body: DeleteAssetAttributeByNameVersionDTO;
}) {
  const { asset_name, version } = body;
  try {
    const assetAttribute =
      await assetAttributeService.delete_asset_att_by_name_version(
        asset_name,
        version
      );
    return {
      success: true,
      message: "Asset attribute deleted successfully",
      data: assetAttribute,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateAssetAttributeById({
  body,
}: {
  body: UpdateAssetAttributeByIdDTO;
}) {
  const { id, event_id, asset_name, version, vendor, cpe, source, exp } = body;
  try {
    const assetAttribute = await assetAttributeService.update_asset_att_by_id(
      id,
      event_id,
      asset_name,
      version,
      vendor,
      cpe,
      source,
      exp
    );
    return {
      success: true,
      message: "Asset attribute updated successfully",
      data: assetAttribute,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
