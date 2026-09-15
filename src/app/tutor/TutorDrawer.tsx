'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';

export default function TutorDrawer({
  exerciseId,
  topic,
  level,
  onClose
}: {
  exerciseId: string;
  topic?: string;
  level?: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ exerciseId });
    if (topic) params.set('topic', topic);
    if (level) params.set('level', level);

    fetch(`/api/tutor/explain?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setExplanation(data.explanation || "No se pudo obtener una explicación.");
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tutor explanation:", err);
        setExplanation("Error al conectar con el servidor del tutor.");
        setLoading(false);
      });
  }, [exerciseId, topic, level]);

  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      className="glass-card"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100%',
        width: '380px',
        maxWidth: '90vw',
        borderRadius: 0,
        borderLeft: '1px solid var(--border)',
        zIndex: 50,
        overflowY: 'auto',
        padding: '1.5rem',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>Tutor Java AI</h2>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
        >
          <X size={20} />
        </button>
      </header>

      <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
              <Lightbulb size={28} color="var(--primary)" />
            </motion.div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontStyle: 'italic' }}>Analizando tu duda...</p>
          </div>
        ) : (
          explanation
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '0.9rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '0.75rem', fontSize: '0.8rem', color: '#a5b4fc', display: 'flex', gap: '0.5rem' }}>
        <span>💡</span>
        <p>Este tutor está diseñado para darte pistas conceptuales y guiarte, no para darte la solución directa.</p>
      </div>
    </motion.aside>
  );
}
