import { tags } from "@src/model/db/schema/tags";
import { and, eq } from "drizzle-orm";
import { dbClient } from "@src/model/db/client";
import { events } from "@src/model/db/schema/events";
import { event_tags } from "@src/model/all-schema";

export class TagService {
  constructor(private db: typeof dbClient) {}

  /**
   * Create a new tag
   * @param tag_name - The name of the tag
   * @param color - The color of the tag
   * @returns The created tag
   */

  async createTag(tag_name: string, color: string) {
    return await this.db.transaction(async (tx) => {
      const existing = await tx.query.tags.findFirst({
        where: and(eq(tags.tag_name, tag_name), eq(tags.color, color)),
      });
      if (existing) {
        throw new Error(
          `Tag with color ${color} and name ${tag_name} already exists.`
        );
      }
      // const existingEvent = await tx.query.events.findFirst({
      //   where: eq(events.id, event_id),
      // });
      // if (!existingEvent) {
      //   throw new Error(`Event with ID ${event_id} does not exist.`);
      // }

      const newTag = await tx
        .insert(tags)
        .values({
          tag_name,
          color,
        })
        .returning();

      // const newEventTag = await tx.insert(event_tags).values({
      //   tag_id: newTag[0].id,
      //   event_id,
      // });
      return newTag;
    });
  }

  /**
   * Create a new event tag
   * @param tag_name - The name of the tag
   * @param event_id - The ID of the event
   * @returns The created event tag
   */

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
      return newEventTag;
    });
  }

  /**
   * Get tags by event ID
   * @param event_id - The ID of the event
   * @returns An array of tags associated with the event
   */

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
        id: tag.tag.id,
        tag_name: tag.tag.tag_name,
        color: tag.tag.color,
      }));
    });
  }

  /**
   * Delete a tag
   * @param tag_name - The name of the tag
   * @param color - The color of the tag
   * @returns The deleted tag
   */

  async deleteTag(tag_name: string, color: string) {
    return await this.db.transaction(async (tx) => {
      const existing = await tx.query.tags.findFirst({
        where: and(eq(tags.tag_name, tag_name), eq(tags.color, color)),
      });
      if (!existing) {
        throw new Error(
          `Tag with color ${color} and name ${tag_name} doesn't exists.`
        );
      }
      const deletedTag = await tx
        .delete(tags)
        .where(and(eq(tags.tag_name, tag_name), eq(tags.color, color)))
        .returning();
      return deletedTag;
    });
  }

  /**
   * Delete a tag from an event
   * @param tag_name - The name of the tag
   * @param event_id - The ID of the event
   * @returns The deleted event tag
   */

  async deleteTaginEvent(tag_name: string, event_id: number) {
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
      const deletedTag = await tx
        .delete(event_tags)
        .where(
          and(
            eq(event_tags.tag_id, existingTag.id),
            eq(event_tags.event_id, event_id)
          )
        )
        .returning();
      return deletedTag;
    });
  }

  /**
   * Update a tag
   * @param id - The ID of the tag
   * @param tag_name - The new name of the tag (optional)
   * @param color - The new color of the tag (optional)
   * @returns The updated tag
   */

  async updateTag(id: number ,tag_name?: string, color?: string) {
    return await this.db.transaction(async (tx) => {
      const existing = await tx.query.tags.findFirst({
        where: eq(tags.id, id),
      });
      if (!existing) {
        throw new Error(
          `Tag with ID ${id} doesn't exists.`
        );
      }
      const current = existing;
      const updateData: Partial<typeof tags.$inferInsert> = {};
      updateData.tag_name = tag_name ? tag_name : current.tag_name;
      updateData.color = color ? color : current.color;

      const updatedTag = await tx
        .update(tags)
        .set(updateData)
        .where(eq(tags.id, id))
        .returning();
      return updatedTag;
    });
  }
}
