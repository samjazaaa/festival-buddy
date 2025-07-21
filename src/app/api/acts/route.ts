import { Day } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // TODO auth?

  const searchParams = request.nextUrl.searchParams;
  // TODO what happens for invalid params?
  const day = searchParams.get("day") as Day;

  const acts = await prisma.act.findMany({ where: { day: day } });
  return Response.json(acts);
}
