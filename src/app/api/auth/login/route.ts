import { scalekit } from "@/app/lib/ScaleKit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_LOCAL_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { error: "PUBLIC_LOCAL_URL is not defined in .env.local" },
      { status: 500 }
    );
  }

  const redirectUrl = `${baseUrl}/api/auth/callback`;

  console.log("Redirect URL:", redirectUrl);

  const url = scalekit.getAuthorizationUrl(redirectUrl);

  return NextResponse.redirect(url);
}