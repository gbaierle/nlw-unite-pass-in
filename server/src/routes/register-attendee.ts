import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Schema, z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function registerAttendee(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/events/:eventId/attendees", {
            schema: {
                summary: "Register an attendee for an event",
                tags: ["attendees"],
                body: z.object({
                    name: z.string().min(4),
                    email: z.string().email(),
                }),
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    201: z.object({
                        attendeeId: z.number().int(),
                    }),
                }
            },
        }, async (request, reply) => {
            const { eventId } = request.params;
            const { name, email } = request.body;

            const attendeeAlreadyExists = await prisma.attendee.findUnique({
                where: {
                    eventId_email: {
                        eventId,
                        email
                    }
                }
            });

            if (attendeeAlreadyExists) {
                throw new BadRequest("Attendee already exists.");
            }

            const [event, attendeesAmount] = await Promise.all([
                prisma.event.findUnique({
                    where: {
                        id: eventId
                    }
                }),

                prisma.attendee.count({
                    where: {
                        eventId
                    }
                })
            ]);

            if (event?.maxAttendees && attendeesAmount >= event?.maxAttendees) {
                throw new BadRequest("Event is full.");
            }

            const attendee = await prisma.attendee.create({
                data: {
                    name,
                    email,
                    eventId,
                }
            })

            return reply.status(201).send({
                attendeeId: attendee.id
            })
        });
}
