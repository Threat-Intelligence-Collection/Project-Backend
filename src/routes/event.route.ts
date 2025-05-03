import { Elysia } from "elysia";
import { createEvent, getEventById, deleteEvent, updateEvents } from "@src/controllers/eventController/event.controller";
import { eventDTO, eventParamsDTO, updateEventDTO } from "@src/dto/event.dto";

export const eventRoute = new Elysia()
.group ("/event", (app) =>
    app
        .post("/create", createEvent, {
            body: eventDTO,
            detail: {
                summary: "Create a new event",
                tags: ["Event"],
            },
        })
        .get("/get/:id", getEventById, {
            params: eventParamsDTO,
            detail: {
                summary: "Get event by ID",
                tags: ["Event"],
            },
        })
        .delete("/delete/:id", deleteEvent, {
            params: eventParamsDTO,
            detail: {
                summary: "Delete event by ID",
                tags: ["Event"],
            },
        })
        .put("/update", updateEvents, {
            body: updateEventDTO,
            detail: {
                summary: "Update event by ID",
                tags: ["Event"],
            },
        })
);