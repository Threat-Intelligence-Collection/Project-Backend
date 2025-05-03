import { attributes } from "@src/model/db/schema/attributes";
import { events } from "@src/model/db/schema/events";
import { and, eq } from "drizzle-orm";
import { dbClient } from "@src/model/db/client";
import { AttributeType } from "@src/dto/attribute.dto";

export class AttributeService {
  constructor(private db: typeof dbClient) {}

  async createAttribute(
    event_id: number,
    type: AttributeType,
    value: string,
    firstseen: Date,
    lastseen: Date
  ) {
    return await this.db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, event_id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${event_id} does not exist.`);
      }
      const newAttribute = await tx
        .insert(attributes)
        .values({
          event_id,
          type,
          value,
          firstseen,
          lastseen,
        })
        .returning();
      return newAttribute;
    });
  }

  async getAttributeByValue(value: string) {
    const attribute = await this.db.query.attributes.findFirst({
      where: eq(attributes.value, value),
    });
    if (!attribute) {
      throw new Error(`Attribute with value ${value} does not exist.`);
    }
    return attribute;
  }

  async deleteAttributeByValue(value: string) {
    const attribute = await this.db.query.attributes.findFirst({
      where: eq(attributes.value, value),
    });
    if (!attribute) {
      throw new Error(`Attribute with value ${value} does not exist.`);
    }
    await this.db.delete(attributes).where(eq(attributes.value, value));
    return { message: `Attribute with value ${value} deleted successfully` };
  }

  async updateAttribute(
    value: string,
    event_id: number,
    type?: AttributeType,
    firstseen?: Date,
    lastseen?: Date
  ) {
    return await this.db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, event_id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${event_id} does not exist.`);
      }
      const existingAttribute = await tx.query.attributes.findFirst({
        where: eq(attributes.value, value),
      });
      if (!existingAttribute) {
        throw new Error(`Attribute with value ${value} does not exist.`);
      }

      const current = existingAttribute;
      const updateData: Partial<typeof attributes.$inferInsert> = {};

      updateData.value = value ? value : current.value;
      updateData.event_id = event_id ? event_id : current.event_id;
      updateData.type = type ? type : current.type;
      updateData.firstseen = firstseen ? firstseen : current.firstseen;
      updateData.lastseen = lastseen ? lastseen : current.lastseen;

      if (Object.keys(updateData).length === 0) {
        throw new Error("No fields provided for update.");
      }

      const updatedAttribute = await tx
        .update(attributes)
        .set(updateData)
        .where(
          and(eq(attributes.value, value), eq(attributes.event_id, event_id))
        )
        .returning();
      return updatedAttribute;
    });
  }
}
