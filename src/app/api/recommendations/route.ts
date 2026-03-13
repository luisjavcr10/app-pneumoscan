import { NextResponse } from "next/server";
import { generateMedicalRecommendations } from "@/lib/gemini";

export async function POST(request: Request) {
    try {
        const { diagnosis, confidence } = await request.json();

        if (!diagnosis || confidence === undefined) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const aiResponse = await generateMedicalRecommendations(diagnosis, confidence);

        // Attempt to parse JSON from AI response
        try {
            // Clean possible markdown code blocks
            const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleaned);
            return NextResponse.json(parsed);
        } catch (parseError) {
            console.error("[Recommendations API] Failed to parse Gemini response:", aiResponse, parseError);
            return NextResponse.json({
                error: "Invalid AI response",
                raw: aiResponse
            }, { status: 500 });
        }
    } catch (err: unknown) {
        const error = err as Error;
        console.error("[Recommendations API] Error:", error.message);
        return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
    }
}
