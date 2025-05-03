import { dbClient } from "@src/model/db/client";
import { EventService } from "@src/services/db_service/events_tb/event.service";
import { eventDTO, eventParamsDTO, updateEventDTO } from "@src/dto/event.dto";

const eventService = new EventService(dbClient);

type CreateEventDTO = typeof eventDTO.static;
type UpdateEventDTO = typeof updateEventDTO.static;
type eventParams = typeof eventParamsDTO.static;

export async function createEvent({ body }: { body: CreateEventDTO }) {
  const { info, user_id, mitigration, threat_level_id } = body;
  try {
    const event = await eventService.createEvent(
      user_id,
      threat_level_id,
      info,
      mitigration
    );
    return {
      success: true,
      message: "Event created successfully",
      data: event,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getEventById({ params }: { params: eventParams }) {
  try {
    const event = await eventService.getEventById(params.id);
    return {
      success: true,
      message: "Event retrieved successfully",
      data: event,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function deleteEvent({ params }: { params: eventParams }) {
  try {
    const event = await eventService.deleteEvent(params.id);
    return {
      success: true,
      message: "Event deleted successfully",
      data: event,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function updateEvents({ body }: { body: UpdateEventDTO }) {
  try {
    const { id, info, user_id, mitigration, threat_level_id } = body;
    const events = await eventService.updateEvent(
      id,
      user_id,
      threat_level_id,
      info,
      mitigration
    );
    return {
      success: true,
      message: "Events updated successfully",
      data: events,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}
