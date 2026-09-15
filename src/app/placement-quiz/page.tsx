"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Question {
    id: number;
    prompt: string;
    options: string[];
}

export default function PlacementQuiz() {
    const { status } = useSession();
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ level: string; correctCount: number; totalQuestions: number } | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    useEffect(() => {
        if (status !== 'authenticated') return;
        fetch('/api/quiz')
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setQuestions(data);
            })
            .catch(() => setError('No se pudo cargar el examen de nivel. Intenta más tarde.'))
            .finally(() => setIsLoading(false));
    }, [status]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const payload = {
                answers: questions.map((q) => ({
                    questionId: q.id,
                    selectedOptionIndex: answers[q.id] ?? -1,
                })),
            };
            const res = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || 'Error al enviar el examen');
            setResult(data);
        } catch (e: any) {
            setError(e.message || 'No se pudo enviar el examen.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                Cargando examen de nivel...
            </div>
        );
    }

    const handleSkip = async () => {
        setIsSkipping(true);
        setError(null);
        try {
            const res = await fetch('/api/quiz/skip', { method: 'POST' });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || 'No se pudo omitir el examen');
            router.push('/dashboard');
        } catch (e: any) {
            setError(e.message || 'No se pudo omitir el examen.');
            setIsSkipping(false);
        }
    };

    if (result) {
        return (
            <div className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '450px', textAlign: 'center', padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>¡Examen completado!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Respondiste correctamente {result.correctCount} de {result.totalQuestions} preguntas.
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1.5rem 0', color: 'var(--primary)' }}>
                        Nivel asignado: {result.level}
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', height: '3rem' }} onClick={() => router.push('/dashboard')}>
                        Ir a mi Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="hero" style={{ minHeight: '100vh', padding: '3rem 1rem' }}>
            <div className="container" style={{ maxWidth: '650px', margin: '0 auto' }}>
                <div className="glass-card" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>Examen de Nivel</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Responde estas preguntas para que podamos ubicarte en el nivel correcto.
                    </p>

                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                        borderRadius: '0.5rem', padding: '0.85rem 1rem', marginBottom: '2rem',
                    }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            ¿Prefieres no hacer el examen ahora?
                        </span>
                        <button
                            onClick={handleSkip}
                            disabled={isSkipping}
                            style={{
                                background: 'none', border: '1px solid var(--border)', color: 'white',
                                padding: '0.4rem 0.9rem', borderRadius: '0.4rem', fontSize: '0.8rem', cursor: 'pointer',
                            }}
                        >
                            {isSkipping ? 'Configurando...' : 'Empezar como Principiante'}
                        </button>
                    </div>

                    {error && <p style={{ color: '#f87171', marginBottom: '1.5rem' }}>{error}</p>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {questions.map((q, idx) => (
                            <div key={q.id}>
                                <p style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>{idx + 1}. {q.prompt}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {q.options.map((option, optIdx) => (
                                        <label
                                            key={optIdx}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                border: `1px solid ${answers[q.id] === optIdx ? 'var(--primary)' : 'var(--border)'}`,
                                                background: answers[q.id] === optIdx ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${q.id}`}
                                                checked={answers[q.id] === optIdx}
                                                onChange={() => setAnswers({ ...answers, [q.id]: optIdx })}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', height: '3rem', marginTop: '2.5rem' }}
                        disabled={isSubmitting || Object.keys(answers).length !== questions.length}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Respuestas'}
                    </button>
                </div>
            </div>
        </div>
    );
}
