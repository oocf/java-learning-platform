"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error || 'Ese usuario o correo ya existe.');
                setLoading(false);
                return;
            }

            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Cuenta creada, pero no se pudo iniciar sesión automáticamente.');
                setLoading(false);
                return;
            }

            router.push('/placement-quiz');
        } catch (err) {
            setError('El servicio de registro no está disponible en este momento.');
            setLoading(false);
        }
    };

    return (
        <div className="hero">
            <div className="container">
                <div className="glass-card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Crea tu Cuenta</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Empieza tu viaje de aprendizaje en Java.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}
                                required
                            />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Correo</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}
                                required
                            />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '0.5rem', color: 'white' }}
                                required
                            />
                        </div>

                        {error && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '1rem', height: '3rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Creando cuenta...' : 'Registrarme'}
                        </button>
                    </form>

                    <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        ¿Ya tienes cuenta? <Link href="/auth/signin" style={{ color: 'var(--primary)' }}>Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
