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
    return await this.db.query.asset_attributes.findMany({
      where: eq(asset_attributes.event_id, event_id),
    });
  }

  async getAssetAttributeByAssetName(asset_name: string) {
    return await this.db.query.asset_attributes.findMany({
      where: eq(asset_attributes.asset_name, asset_name),
    });
  }

  async deleteAssetAttributeByAssetName(asset_name: string, version: string) {
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
        .where(and(
          eq(asset_attributes.asset_name, asset_name),
          eq(asset_attributes.version, version)
        ));
      return assetAttribute;
    });
  }
}
