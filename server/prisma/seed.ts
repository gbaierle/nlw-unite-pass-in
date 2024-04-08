import { prisma } from "../src/lib/prisma";

async function seed() {
    await prisma.event.create({
        data: {
            id: "c7a6d8e0-9f6b-4b1b-9b64-1a8d9f5d1e9e",
            title: "Unite Summit",
            slug: "unite-summit",
            details: "Join us for our next summit!",
            maxAttendees: 120,
        }
    });
}

seed().then(() => {
    console.log("Database seeded!");
}).finally(() => {
    prisma.$disconnect();
});
