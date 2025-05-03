import { dbClient } from "@src/model/db/client";
import { TagService } from "@src/services/db_service/tag/tag.service";
import { tagDTO, eventTagDTO, eventIDparams, updateTagDTO } from "@src/dto/tag.dto";

const tagService = new TagService(dbClient);

type CreateTagDTO = typeof tagDTO.static;
type DeleteTagDTO = typeof tagDTO.static;
type UpdateTagDTO = typeof updateTagDTO.static;
type EventTagDTO = typeof eventTagDTO.static;
type EventIDParams = typeof eventIDparams.static;

export async function createTag({ body }: { body: CreateTagDTO }) {
  const { tag_name, color } = body;
  try {
    const tag = await tagService.createTag(tag_name, color);
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

export async function deleteTag({ body }: { body: DeleteTagDTO }) {
  const { tag_name, color } = body;
  try {
    const tag = await tagService.deleteTag(tag_name, color);
    return {
      success: true,
      message: "Tag deleted successfully",
      data: tag,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteTaginEvent({ body }: { body: EventTagDTO }) {
  const { tag_name, event_id } = body;
  try {
    const tag = await tagService.deleteTaginEvent(tag_name, event_id);
    return {
      success: true,
      message: "Tag deleted from event successfully",
      data: tag,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateTag({ body }: { body: UpdateTagDTO }) {
  const { id, tag_name, color } = body;
  try {
    const tag = await tagService.updateTag(id, tag_name, color);
    return {
      success: true,
      message: "Tag updated successfully",
      data: tag,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
