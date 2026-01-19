'use client';

import { useState } from 'react';
import TutorDrawer from './TutorDrawer';

export default function TutorHelpButton({ exerciseId }: { exerciseId: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-sm text-blue-600 underline"
            >
                ¿Necesitas ayuda?
            </button>

            {open && (
                <TutorDrawer
                    exerciseId={exerciseId}
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}
