import { PrismaClient, Prisma } from "@/generated/prisma";
import bcrypt from "bcrypt";
import type { Day } from "@/generated/prisma";

// TODO read seed file from env?
import seedData from "./seed-data-openbeatz-2025.json";

const prisma = new PrismaClient();

export async function main() {
  // Test user with pw 12345
  const userData: Prisma.UserCreateInput[] = [
    {
      name: "testuser",
      password: await bcrypt.hash("123456", 12),
    },
  ];

  for (const u of userData) {
    await prisma.user.create({ data: u });
  }

  for (const stage of seedData.stages) {
    const stageObj = await prisma.stage.create({ data: { name: stage.stage } });
    for (const day of stage.days) {
      for (const act of day.acts) {
        await prisma.act.create({
          data: {
            artist: act.artist,
            day: day.day as Day,
            start: act.start,
            end: act.end,
            stage: { connect: stageObj },
          },
        });
      }
    }
  }
}

main();
