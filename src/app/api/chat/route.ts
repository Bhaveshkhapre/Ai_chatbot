import connectDB from "@/app/lib/db";
import Settings from "@/model/aibot.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { message, ownerId } = await req.json();

        if (!message || !ownerId) {
            return NextResponse.json(
                { message: "message and ownerId is required" },
                {
                    status: 400,
                    headers: corsHeaders(),
                }
            );
        }

        await connectDB();

        const setting = await Settings.findOne({ ownerId });

        if (!setting) {
            return NextResponse.json(
                { message: "ChatBot is not configured yet." },
                {
                    status: 400,
                    headers: corsHeaders(),
                }
            );
        }

        const KNOWLEDGE = `
business name - ${setting.businessName || "not provided"}
support email - ${setting.supportEmail || "not provided"}
knowledge - ${setting.knowledge || "not provided"}
`;

        const prompt = `
You are a professional customer support assistant for this business.

Use ONLY the information provided below.
Do NOT invent policies or promises.

If unrelated, reply exactly with:
"Please contact support."

----------------------
BUSINESS INFORMATION
----------------------

${KNOWLEDGE}

----------------------
CUSTOMER QUESTION
----------------------

${message}

----------------------
ANSWER
`;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!,
        });

        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const reply = aiResponse.text || "Please contact support.";

        return NextResponse.json(
            { reply },
            {
                status: 200,
                headers: corsHeaders(),
            }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Chat error", error: String(error) },
            {
                status: 500,
                headers: corsHeaders(),
            }
        );
    }
}

 function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders() });
}