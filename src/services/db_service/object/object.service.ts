import { objects } from "@src/model/db/schema/objects";
import { events } from "@src/model/db/schema/events";
import { eq } from "drizzle-orm";
import { dbClient } from "@src/model/db/client";

export class ObjectService {
  constructor(private db: typeof dbClient) {}

  async createObject(
    event_id: number,
    object_name: string,
    description?: string
  ) {
    return await this.db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, event_id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${event_id} does not exist.`);
      }
      const newObject = await tx
        .insert(objects)
        .values({
          event_id,
          object_name,
          description,
        })
        .returning();
      return newObject;
    });
  }

  async getObject(event_id: number) {
    return await this.db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, event_id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${event_id} does not exist.`);
      }
      const object = await tx.query.objects.findMany({
        where: eq(objects.event_id, event_id),
      });
      return object;
    });
  }

  async deleteObject(id: number) {
    return await this.db.transaction(async (tx) => {
      const object = await tx.query.objects.findFirst({
        where: eq(objects.id, id),
      });
      if (!object) {
        throw new Error(`Object with ID ${id} does not exist.`);
      }
      await tx.delete(objects).where(eq(objects.id, id));
      return { message: `Object with ID ${id} deleted successfully.` };
    });
  }

  async updateObject(
    id: number,
    event_id: number,
    object_name?: string,
    description?: string
  ) {
    return await this.db.transaction(async (tx) => {
      const existingObject = await tx.query.objects.findFirst({
        where: eq(objects.id, id),
      });
      if (!existingObject) {
        throw new Error(`Object with ID ${id} does not exist.`);
      }

      const current = existingObject;
      const updateData: Partial<typeof objects.$inferInsert> = {};

      if (event_id) {
        const existingEvent = await tx.query.events.findFirst({
          where: eq(events.id, event_id),
        });
        if (!existingEvent) {
          throw new Error(`Event with ID ${event_id} does not exist.`);
        }
      }

      updateData.event_id = event_id ? event_id : current.event_id;
      updateData.object_name = object_name ? object_name : current.object_name;
      updateData.description = description ? description : current.description;

      if (Object.keys(updateData).length === 0) {
        throw new Error("No fields provided for update.");
      }

      const updatedObject = await tx
        .update(objects)
        .set(updateData)
        .where(eq(objects.id, id))
        .returning();
      return updatedObject;
    });
  }
}
