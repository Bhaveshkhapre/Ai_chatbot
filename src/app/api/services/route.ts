import connectDB from "@/app/lib/db";
import Settings from "@/model/aibot.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { ownerId, businessName, supportEmail, knowledge } = await req.json();

    if (!ownerId || !businessName || !supportEmail) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

    await connectDB();

    const settings = await Settings.findOneAndUpdate(
      { ownerId },
      { businessName, supportEmail, knowledge },
      { new: true, upsert: true }
    );    

    return NextResponse.json(settings);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


