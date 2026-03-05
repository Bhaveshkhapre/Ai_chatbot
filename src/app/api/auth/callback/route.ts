import { scalekit } from "@/app/lib/ScaleKit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_URL;

     if (!baseUrl) {
    return NextResponse.json(
      { error: "PUBLIC_LOCAL_URL is not defined in .env.local" },
      { status: 500 }
    );
  }

  const redirectUrl = `${baseUrl}/api/auth/callback`;

    const code = searchParams.get("code")
    if (!code) {
        return NextResponse.json({ message: "code is not found" }, { status: 400 })

    }

    const session = scalekit.authenticateWithCode(code,redirectUrl)
    console.log(session)
    const responses = NextResponse.redirect(baseUrl)

    responses.cookies.set("access_Token", (await session).accessToken,{
        httpOnly:true,
        maxAge:24*60*60*1000, 
        secure:true,
        path:"/"
    })

    return responses
}