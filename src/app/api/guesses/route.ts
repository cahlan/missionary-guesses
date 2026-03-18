import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const guesses = await prisma.guess.groupBy({
    by: ["missionName"],
    _count: { missionName: true },
    orderBy: { _count: { missionName: "desc" } },
  });

  return NextResponse.json(
    guesses.map((g) => ({
      missionName: g.missionName,
      count: g._count.missionName,
    }))
  );
}

export async function POST(request: Request) {
  const { missionName } = await request.json();

  if (!missionName || typeof missionName !== "string") {
    return NextResponse.json({ error: "Invalid mission name" }, { status: 400 });
  }

  const guess = await prisma.guess.create({
    data: { missionName },
  });

  return NextResponse.json(guess, { status: 201 });
}
