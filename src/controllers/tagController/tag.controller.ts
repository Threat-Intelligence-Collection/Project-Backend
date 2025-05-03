import { dbClient } from "@src/model/db/client";
import { TagService } from "@src/services/db_service/tag/tag.service";
import { tagDTO, eventTagDTO, eventIDparams } from "@src/dto/tag.dto";

const tagService = new TagService(dbClient);

type CreateTagDTO = typeof tagDTO.static;
type EventTagDTO = typeof eventTagDTO.static;
type EventIDParams = typeof eventIDparams.static;

export async function createTag({ body }: { body: CreateTagDTO }) {
  const { tag_name, color, event_id } = body;
  try {
    const tag = await tagService.createTag(tag_name, color, event_id);
    return {
      success: true,
      message: "Tag created successfully",
      data: tag,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function createEventTag({ body }: { body: EventTagDTO }) {
  const { tag_name, event_id } = body;
  try {
    const eventTag = await tagService.createEventTag(tag_name, event_id);
    return {
      success: true,
      message: "Event tag created successfully",
      data: eventTag,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getTagsByEventId({ params }: { params: EventIDParams }) {
  const { event_id } = params;
  try {
    const tags = await tagService.getTagsByEventId(event_id);
    return {
      success: true,
      message: "Tags retrieved successfully",
      data: tags,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
