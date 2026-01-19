'use client';

import { useEffect, useState } from 'react';

export default function TutorDrawer({
  exerciseId,
  onClose
}: {
  exerciseId: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    fetch(`/api/tutor/explain?exerciseId=${exerciseId}`)
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
  }, [exerciseId]);

  return (
    <aside className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-4 z-50 overflow-y-auto" style={{ borderLeft: '1px solid #e5e7eb' }}>
      <header className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Tutor Java AI</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-500 italic">Analizando tu duda...</p>
          </div>
        ) : (
          explanation
        )}
      </div>

      <div className="mt-8 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700 flex items-start gap-2">
        <span>💡</span>
        <p>Este tutor está diseñado para darte pistas conceptuales y guiarte, no para darte la solución directa.</p>
      </div>
    </aside>
  );
}
