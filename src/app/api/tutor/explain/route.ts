import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
    const session: any = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const exerciseId = searchParams.get('exerciseId');
    const topic = searchParams.get('topic') || 'Java Basics';
    const level = searchParams.get('level') || 'BEGINNER';

    if (!exerciseId) {
        return NextResponse.json({ error: 'Exercise ID is required' }, { status: 400 });
    }

    try {
        const response = await fetch('http://localhost:8000/explain-exercise', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: session?.user?.username || 'anonymous',
                student_level: level,
                topic,
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
