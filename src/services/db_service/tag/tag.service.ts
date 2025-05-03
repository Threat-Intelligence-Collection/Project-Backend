import { tags } from "@src/model/db/schema/tags";
import { and, eq } from "drizzle-orm";
import { dbClient } from "@src/model/db/client";
import { events } from "@src/model/db/schema/events";
import { event_tags } from "@src/model/all-schema";

export class TagService {
  constructor(private db: typeof dbClient) {}

  async createTag(tag_name: string, color: string, event_id: number) {
    return await this.db.transaction(async (tx) => {
      const existing = await tx.query.tags.findFirst({
        where: and(eq(tags.tag_name, tag_name), eq(tags.color, color)),
      });
      if (existing) {
        throw new Error(
          `Tag with color ${color} and name ${tag_name} already exists.`
        );
      }
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, event_id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${event_id} does not exist.`);
      }

      const newTag = await tx
        .insert(tags)
        .values({
          tag_name,
          color,
        })
        .returning();

      const newEventTag = await tx
        .insert(event_tags)
        .values({
          tag_id: newTag[0].id,
          event_id,
        });
      return newTag[0];
    });
  }

  async createEventTag(tag_name: string, event_id: number) {
    return await this.db.transaction(async (tx) => {
      const existingTag = await tx.query.tags.findFirst({
        where: eq(tags.tag_name, tag_name),
      });
      if (!existingTag) {
        throw new Error(`Tag with name ${tag_name} does not exist.`);
      }
      const existingEvent = await tx.query.events.findFirst({
        where: eq(events.id, event_id),
      });
      if (!existingEvent) {
        throw new Error(`Event with ID ${event_id} does not exist.`);
      }
      const existingEventTag = await tx.query.event_tags.findFirst({
        where: and(
          eq(event_tags.tag_id, existingTag.id),
          eq(event_tags.event_id, event_id)
        ),
      });
      if (existingEventTag) {
        throw new Error(
          `Event tag with tag ID ${existingTag.id} and event ID ${event_id} already exists.`
        );
      }

      const newEventTag = await tx
        .insert(event_tags)
        .values({
          tag_id: existingTag.id,
          event_id,
        })
        .returning();
      return newEventTag[0];
    });
  }

  async getTagsByEventId(event_id: number) {
    return await this.db.transaction(async (tx) => {
        const existingEvent = await tx.query.events.findFirst({
            where: eq(events.id, event_id),
        });
        if (!existingEvent) {
            throw new Error(`Event with ID ${event_id} does not exist.`);
        }
        const tags = await tx.query.event_tags.findMany({
            where: eq(event_tags.event_id, event_id),
            with: {
            tag: true,
            },
        });
        return tags.map((tag) => ({
            tag_name: tag.tag.tag_name,
            color: tag.tag.color,
        }));
    });
  }
}
