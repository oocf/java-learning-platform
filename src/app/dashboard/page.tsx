"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Lock, Play } from 'lucide-react';
import { curriculum, Lesson } from '@/lib/curriculum';
import TutorHelpButton from "../tutor/TutorHelpButton";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Dashboard() {
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'white' }}>
            {/* Header */}
            <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-dark)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <Sparkles size={24} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Java Master Path</h1>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progreso Total</span>
                        <div style={{ width: '150px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '4px' }}>
                            <div style={{ width: '10%', height: '100%', background: '#22c55e', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)' }}></div>
                </div>
            </header>

            <main className="path-container">
                {curriculum.map((module, mIdx) => (
                    <div key={module.id} style={{ width: '100%' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="module-header"
                        >
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{module.title}</h2>
                            <p style={{ opacity: 0.9 }}>Módulo {mIdx + 1}</p>
                        </motion.div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', marginTop: '2rem' }}>
                            {module.lessons.map((lesson, lIdx) => {
                                const isCompleted = completedLessons.includes(lesson.id);
                                const isAvailable = lIdx === 0 || completedLessons.includes(module.lessons[lIdx - 1].id);

                                return (
                                    <motion.div
                                        key={lesson.id}
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: lIdx * 0.1 }}
                                    >
                                        <button
                                            className={`lesson-node ${isCompleted ? 'completed' : isAvailable ? 'active' : ''}`}
                                            disabled={!isAvailable}
                                            onClick={() => setSelectedLesson(lesson)}
                                            style={{
                                                marginLeft: `${Math.sin(lIdx * 1.5) * 60}px` // Duolingo wavy path
                                            }}
                                        >
                                            {isCompleted ? <CheckCircle2 size={32} /> : isAvailable ? <Play size={32} fill="white" /> : <Lock size={32} opacity={0.5} />}
                                            <div className="lesson-tooltip">
                                                {lesson.title}
                                            </div>
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </main>

            {/* Lesson Runner Overlay */}
            <AnimatePresence>
                {selectedLesson && (
                    <LessonRunner
                        lesson={selectedLesson}
                        onClose={() => setSelectedLesson(null)}
                        onComplete={() => {
                            setCompletedLessons([...completedLessons, selectedLesson.id]);
                            setSelectedLesson(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function LessonRunner({ lesson, onClose, onComplete }: { lesson: Lesson, onClose: () => void, onComplete: () => void }) {
    const [cards, setCards] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [error, setError] = useState<string | null>(null);

    const fetchCards = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ objective: lesson.objective, action: 'generate' }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setCards(data.cards);
        } catch (e: any) {
            console.error("Failed to load cards", e);
            setError(e.message || "Error al conectar con el servidor de IA. ¿Está encendido?");
        } finally {
            setIsLoading(false);
        }
    }, [lesson.objective]);

    React.useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserAnswer('');
            setFeedback(null);
        } else {
            onComplete();
        }
    };

    const checkAnswer = () => {
        const currentCard = cards[currentIndex];
        if (!currentCard) return;

        const actualAnswer = userAnswer.toLowerCase().trim();
        const expectedAnswer = (currentCard.correctAnswer || currentCard.answer || "").toLowerCase().trim();

        if (actualAnswer === expectedAnswer && expectedAnswer !== "") {
            setFeedback({ type: 'success', message: '¡Perfecto! Es correcto. 🎉' });
        } else {
            setFeedback({ type: 'error', message: `Casi. ¡Inténtalo de nuevo!` });
        }
    };

    if (isLoading) return (
        <div className="lesson-runner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                    <Sparkles size={48} color="var(--primary)" />
                </motion.div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>La IA está preparando tus tarjetas de lección...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="lesson-runner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
                <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>Aprendizaje Detenido</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{error}</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn" onClick={onClose} style={{ border: '1px solid var(--border)' }}>Cancelar</button>
                    <button className="btn btn-primary" onClick={fetchCards}>Reintentar Generación</button>
                </div>
            </div>
        </div>
    );

    const currentCard = cards[currentIndex];

    return (
        <motion.div
            className="lesson-runner"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
            <header style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '2rem', background: 'var(--bg-dark)' }}>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}></div>
                </div>
            </header>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card"
                        style={{ width: '100%', maxWidth: '600px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}
                    >
                        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {currentCard.type}
                        </h2>
                        <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{currentCard.title}</h3>

                        <div style={{ flex: 1 }}>
                            <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {currentCard.content}
                                </ReactMarkdown>
                            </div>

                            {currentCard.type === 'example' && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <pre style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                                        <code style={{ color: '#e2e8f0' }}>{currentCard.code}</code>
                                    </pre>
                                </div>
                            )}

                            {currentCard.type === 'challenge' && (
                                <div style={{ marginTop: '2rem' }}>
                                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>{currentCard.question}</p>
                                    <input
                                        type="text"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (feedback?.type === 'success') handleNext();
                                                else checkAnswer();
                                            }
                                        }}
                                        placeholder="Escribe tu respuesta aquí..."
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '0.5rem', color: 'white', fontSize: '1.1rem', outline: 'none' }}
                                    />
                                    <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                                        <TutorHelpButton exerciseId={lesson?.id || "unknown"} />
                                    </div>
                                    {feedback && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '1rem', color: feedback.type === 'success' ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
                                            {feedback.message}
                                        </motion.p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            {currentCard.type === 'challenge' && !feedback?.message.includes('Perfecto') ? (
                                <button className="btn btn-primary" onClick={checkAnswer} style={{ padding: '0.75rem 2.5rem' }}>
                                    Comprobar Respuesta
                                </button>
                            ) : (
                                <button className="btn btn-primary" onClick={handleNext} style={{ padding: '0.75rem 2.5rem' }}>
                                    {currentIndex === cards.length - 1 ? 'Finalizar Lección' : 'Continuar'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
