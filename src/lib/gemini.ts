import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn(
        "[Gemini] ⚠️ GEMINI_API_KEY no está configurada. Las funciones de IA no estarán disponibles.",
    );
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export class GeminiError extends Error {
    public readonly retriable: boolean;
    public readonly statusCode: number;

    constructor(message: string, options?: { retriable?: boolean; statusCode?: number }) {
        super(message);
        this.name = "GeminiError";
        this.retriable = options?.retriable ?? false;
        this.statusCode = options?.statusCode ?? 500;
    }
}

const GEMINI_MODELS = ["gemini-1.5-flash", "gemini-2.0-flash"];
const MAX_RETRIES = 3;

async function callGeminiWithRetry(prompt: string): Promise<string> {
    if (!genAI) {
        throw new GeminiError("Servicio de IA no disponible", { retriable: false, statusCode: 503 });
    }

    let lastError: Error | null = null;

    for (const modelName of GEMINI_MODELS) {
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const text = result.response.text();

                if (!text) throw new Error("Respuesta vacía");
                return text;
            } catch (err: unknown) {
                const error = err as { status?: number; message?: string };
                console.error(`[Gemini] Error en intento ${attempt + 1} con ${modelName}:`, error.message || err);
                lastError = err instanceof Error ? err : new Error(String(err));

                if (error.status === 429) {
                    const waitMs = Math.min(1000 * Math.pow(2, attempt), 10000);
                    await new Promise(resolve => setTimeout(resolve, waitMs));
                    continue;
                }
                break;
            }
        }
    }

    throw new GeminiError(`Error de IA: ${lastError?.message || "Desconocido"}`, { retriable: true, statusCode: 503 });
}

export async function generateMedicalRecommendations(diagnosis: string, confidence: number): Promise<string> {
    const prompt = `Eres un experto médico neumólogo. Genera un informe profesional y empático en español basado en una radiografía de tórax.

DATOS DEL ANÁLISIS:
- Diagnóstico: ${diagnosis}
- Confianza del modelo de IA: ${confidence.toFixed(1)}%

Genera un informe en formato JSON con la siguiente estructura exacta:
{
  "details": "Un párrafo técnico y claro sobre los hallazgos en la imagen.",
  "recommendations": ["Recomendación 1", "Recomendación 2", "Recomendación 3"]
}

IMPORTANTE: 
- Si el diagnóstico es Neumonía, sé cauteloso y recomienda atención urgente.
- Si es Normal, indica que no se observan anomalías pero que sigan indicaciones médicas.
- Devuelve SOLO el JSON, sin markdown, sin texto adicional.`;

    return callGeminiWithRetry(prompt);
}
