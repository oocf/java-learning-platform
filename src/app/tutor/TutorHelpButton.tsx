'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import TutorDrawer from './TutorDrawer';

export default function TutorHelpButton({ exerciseId, topic, level }: { exerciseId: string; topic?: string; level?: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                }}
            >
                <HelpCircle size={16} />
                ¿Necesitas ayuda?
            </button>

            <AnimatePresence>
                {open && (
                    <TutorDrawer
                        exerciseId={exerciseId}
                        topic={topic}
                        level={level}
                        onClose={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
