import { sendEmail } from "@/lib/mail.utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const sender = {
    name: "Clash Of Titans FPL",
    address: "no-reply@example.com",
  };
  const recepients = [
    {
      name: "Jared FPL",
      address: "bekeeprecious29@gmail.com",
    },
  ];

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
    const result = await sendEmail({
      sender,
      recepients,
      subject: "New Registration",
      message: `New registration with details: Name: ${firstName} ${lastName}. 
      Email: ${email} and phone number ${phoneNumber}. 
      Team name: ${fplTeam}. Twitter ${twitter} and insta ${instagram}. 
      Paid for ${category} and link to receipt "${imageUrl}"`,
    });
    console.log(result);

    return NextResponse.json({ accepted: result.accepted });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error, message: "Error sending email" },
      { status: 500 }
    );
  }
}
