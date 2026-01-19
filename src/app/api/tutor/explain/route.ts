import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
        return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
    }

    try {
        // In a real scenario, we would fetch the exercise details from the DB or curriculum
        // For now, we'll send a request to our Python LLM service
        const response = await fetch('http://localhost:8000/explain-exercise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_level: 'BEGINNER', // This should come from the user session/DB
                topic: 'Java Basics',
                exercise_description: `Explain the concept for exercise ${exerciseId}`,
                constraints: { max_words: 50 }
            })
        });

        if (!response.ok) {
            throw new Error('Python service failed');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Tutor API Error:', error);
        return NextResponse.json({
            explanation: "Lo siento, el Tutor no está disponible en este momento. Inténtalo más tarde."
        });
    }
}
