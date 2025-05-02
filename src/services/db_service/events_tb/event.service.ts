import { events } from "@src/model/db/schema/events";
import { users } from "@src/model/db/schema/user";
import { eq } from "drizzle-orm";
import { dbClient } from "@src/model/db/client";

export class EventService {
  constructor(private db: typeof dbClient) {}

  async createEvent(
    user_id: number,
    threat_level_id: number,
    info?: string,
    mitigration?: string
  ) {
    return await this.db.transaction(async (tx) => {
      const existingUser = await tx.query.users.findFirst({
        where: eq(users.id, user_id),
      });
      if (!existingUser) {
        throw new Error(`User with ID ${user_id} does not exist.`);
      }

      if (threat_level_id >= 10 || threat_level_id < 0) {
        throw new Error(`Threat level ID ${threat_level_id} is invalid.`);
      }
      const newEvent = await tx
        .insert(events)
        .values({
          info,
          user_id,
          mitigration,
          threat_level_id,
        })
        .returning();
      return newEvent;
    });
  }

  async getEventById(id: number) {
    return await this.db.transaction(async (tx) => {
      const event = await tx.query.events.findFirst({
        where: eq(events.id, id),
        with: {
          user: true,
        },
      });
      if (!event) {
        throw new Error(`Event with ID ${id} not found`);
      }
      return event;
    });
  }

  async deleteEvent(id: number) {
    return await this.db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${id} does not exist.`);
      }
      const deletedEvent = await tx
        .delete(events)
        .where(eq(events.id, id))
        .returning();
      return deletedEvent;
    });
  }

  async updateEvent(
    id: number,
    user_id?: number,
    threat_level_id?: number,
    info?: string,
    mitigration?: string
  ) {
    return await this.db.transaction(async (tx) => {
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${id} does not exist.`);
      }
      const current = existingEvent;
      const updateData: Partial<typeof events.$inferInsert> = {};

      if(user_id){
        const existingUser = await tx.query.users.findFirst({
          where: eq(users.id, user_id),
        });
        if (!existingUser) {
          throw new Error(`User with ID ${user_id} does not exist.`);
        }
     }

      updateData.user_id = user_id ? user_id : current.user_id;
      updateData.threat_level_id = threat_level_id
        ? threat_level_id
        : current.threat_level_id;
      updateData.info = info ? info : current.info;
      updateData.mitigration = mitigration ? mitigration : current.mitigration;

      if (Object.keys(updateData).length === 0) {
        throw new Error("No fields provided for update.");
      }

      const updatedEvent = await tx
        .update(events)
        .set(updateData)
        .where(eq(events.id, id))
        .returning();
      return updatedEvent;
    });
  }
}
