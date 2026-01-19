import { NextResponse } from "next/server";
import { Ollama } from "ollama";

// Use environment variables for security and flexibility
const OLLAMA_HOST = process.env.OLLAMA_HOST || "https://ollama.com";
const MODEL_NAME = process.env.OLLAMA_MODEL || "gpt-oss:120b";
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY || "a09f933f43974cff8f96bc5bef974af0.xikMCcip4XsFeMmf4RRj3gSL";

// Initialize Ollama client

const ollama = new Ollama({
    host: OLLAMA_HOST,
    headers: OLLAMA_API_KEY ? {
        Authorization: `Bearer ${OLLAMA_API_KEY}`,
    } : {},
});

/**
 * EXPERT SYSTEM PROMPT FOR CARD GENERATION (SPANISH)
 */
const getSystemPrompt = (objective: string) => `
Eres un Tutor experto en Java para la plataforma "Java Master Path".
Tu objetivo es generar una lección estructurada de 4 tarjetas para: "${objective}"

Debes responder ÚNICAMENTE con un objeto JSON válido que siga esta estructura:
{
  "cards": [
    { "type": "theory", "title": "Concepto", "content": "Explicación pedagógica corta en español." },
    { "type": "example", "title": "En Práctica", "content": "Explicación del código en español.", "code": "Fragmento de código Java" },
    { "type": "challenge", "title": "Tu Turno", "content": "Tarea interactiva para el usuario.", "question": "La pregunta en español", "correctAnswer": "Palabra única o frase corta" },
    { "type": "victory", "title": "¡Lección Completada!", "content": "Resumen de lo aprendido en español." }
  ]
}

Reglas:
1. No uses Markdown fuera de los campos de contenido.
2. Asegúrate de que el JSON sea válido y se pueda parsear.
3. Mantén las explicaciones concisas y claras.
4. El desafío debe ser simple (ej. "¿Qué palabra clave se usa para declarar una clase?").
5. TODO EL CONTENIDO DEBE ESTAR EN ESPAÑOL.
`;

export async function POST(req: Request) {
    try {
        const { objective, action } = await req.json();

        if (action === "generate") {
            const response = await ollama.chat({
                model: MODEL_NAME,
                messages: [{ role: 'user', content: getSystemPrompt(objective) }],
                stream: false,
                format: "json",
            });

            const content = response.message.content;

            try {
                // Find the first '{' and last '}' to extract JSON in case AI adds text
                const jsonStart = content.indexOf('{');
                const jsonEnd = content.lastIndexOf('}') + 1;
                const jsonString = content.substring(jsonStart, jsonEnd);

                const lessonData = JSON.parse(jsonString);
                return NextResponse.json(lessonData);
            } catch (parseError) {
                console.error("JSON Parse Error. Content received:", content);
                throw new Error("AI returned invalid JSON format.");
            }
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("Ollama API Error:", error);
        const message = error.name === 'AbortError'
            ? "The request took too long. The remote server might be busy."
            : `Ollama failed to generate the lesson. Error: ${error.message}`;

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
