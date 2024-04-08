import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerAttendee } from "./routes/register-attendee";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./error-handler";
import fastifyCors from "@fastify/cors";

export const app = fastify();

app.register(fastifyCors, {
    origin: "*",
});

app.register(fastifySwagger, {
    swagger: {
        consumes: ["application/json"],
        produces: ["application/json"],
        info: {
            title: "pass.in",
            description: "API Specification for the back-end of the pass.in app.",
            version: "1.0.0",
        },
    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
});

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Add API routes
app.register(createEvent);
app.register(registerAttendee)
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.setErrorHandler(errorHandler);

app.listen({ port: 3000, host: "0.0.0.0" }).then(() =>
    console.log("HTTP server running!")
);
