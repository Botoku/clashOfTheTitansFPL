import Entry from "@/lib/models/EntryModel";
import connectionToDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      twitter,
      instagram,
      fplTeam,
      category,
      imageUrl,
    } = await request.json();

    await connectionToDB();
    const newEntry = await Entry.create({
      firstName,
      lastName,
      email,
      phoneNumber: Number(phoneNumber),
      twitter,
      instagram,
      fplTeam,
      category,
      imageUrl,
    });

    return NextResponse.json({ newEntry, status: 201 });
} catch (error) {
    console.log(error)
    return NextResponse.json({ error, status: 400 });
  }
}
