import Entry from "@/lib/models/EntryModel";
import connectionToDB from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";

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
      phoneNumber: phoneNumber,
      twitter,
      instagram,
      fplTeam,
      category,
      imageUrl,
    });

    return NextResponse.json({ newEntry, status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, status: 400 });
  }
}

export async function GET() {
  try {
    await connectionToDB();
    const users = await Entry.find({});
    return NextResponse.json({ users, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json();
    await connectionToDB();

    const newEntry = await Entry.findByIdAndUpdate(data._id, data);
    return NextResponse.json({ newEntry, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    await connectionToDB();
    const deletedEntry = await Entry.findByIdAndDelete(data)
     return NextResponse.json({ deletedEntry, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, status: 400 });
  }
}
