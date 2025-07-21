import prisma from "@/lib/prisma";

export async function GET() {
  const stages = await prisma.stage.findMany();
  return Response.json(stages);
}
