import { asset_attributes } from "@src/model/all-schema";
import { events } from "@src/model/all-schema";
import { and, eq } from "drizzle-orm";
import { dbClient } from "@src/model/db/client";

export class AssetAttributeService {
  constructor(private db: typeof dbClient) {}

  async createAssetAttribute(
    event_id: number,
    asset_name: string,
    version: string,
    vendor: string,
    cpe: string,
    source: string,
    exp: Date
  ) {
    return await this.db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, event_id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${event_id} does not exist.`);
      }
      const existingAssetAttribute = await tx.query.asset_attributes.findFirst({
        where: and(
          eq(asset_attributes.asset_name, asset_name),
          eq(asset_attributes.version, version)
        ),
      });
      if (existingAssetAttribute) {
        throw new Error(
          `Asset attribute with name ${asset_name} and version ${version} already exists.`
        );
      }
      const newAssetAttribute = await tx
        .insert(asset_attributes)
        .values({
          event_id,
          asset_name,
          version,
          vendor,
          cpe,
          source,
          exp,
        })
        .returning();
      return newAssetAttribute;
    });
  }

  async getAssetAttributesByEventId(event_id: number) {
    return await this.db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, event_id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${event_id} does not exist.`);
      }
      const assetAttributes = await tx.query.asset_attributes.findMany({
        where: eq(asset_attributes.event_id, event_id),
      });
      return assetAttributes;
    });
  }

  async getAssetAttributeByAssetName(asset_name: string) {
    const decodedName = decodeURIComponent(asset_name);
    const assetAttribute = await this.db.query.asset_attributes.findMany({
      where: eq(asset_attributes.asset_name, decodedName),
    });

    if (!assetAttribute || assetAttribute.length === 0) {
      throw new Error(
        `Asset attribute with name ${decodedName} does not exist.`
      );
    }

    return assetAttribute;
  }

  async delete_asset_att_by_name_version(asset_name: string, version: string) {
    return await this.db.transaction(async (tx) => {
      const assetAttribute = await tx.query.asset_attributes.findFirst({
        where: and(
          eq(asset_attributes.asset_name, asset_name),
          eq(asset_attributes.version, version)
        ),
      });
      if (!assetAttribute) {
        throw new Error(
          `Asset attribute with name ${asset_name} and version ${version} does not exist.`
        );
      }
      await tx
        .delete(asset_attributes)
        .where(
          and(
            eq(asset_attributes.asset_name, asset_name),
            eq(asset_attributes.version, version)
          )
        );
      return assetAttribute;
    });
  }

  async update_asset_att_by_id(
    id: number,
    event_id?: number,
    asset_name?: string,
    version?: string,
    vendor?: string,
    cpe?: string,
    source?: string,
    exp?: Date
  ) {
    return await this.db.transaction(async (tx) => {
      const assetAttribute = await tx.query.asset_attributes.findFirst({
        where: eq(asset_attributes.id, id),
      });
      if (!assetAttribute) {
        throw new Error(`Asset attribute with asset id ${id} does not exist.`);
      }

      const current = assetAttribute;
      const updateData: Partial<typeof asset_attributes.$inferInsert> = {};
      updateData.event_id = event_id ? event_id : current.event_id;
      updateData.asset_name = asset_name ? asset_name : current.asset_name;
      updateData.version = version ? version : current.version;
      updateData.vendor = vendor ? vendor : current.vendor;
      updateData.cpe = cpe ? cpe : current.cpe;
      updateData.source = source ? source : current.source;
      updateData.exp = exp ? exp : current.exp;

      if (Object.keys(updateData).length === 0) {
        throw new Error("No fields provided for update.");
      }

      const updatedAssetAttribute = await tx
        .update(asset_attributes)
        .set(updateData)
        .where(eq(asset_attributes.id, id))
        .returning();
      return updatedAssetAttribute;
    });
  }
}
