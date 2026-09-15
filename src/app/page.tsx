import Link from 'next/link';
import { Sparkles, Brain, MessagesSquare, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          <span className="navbar-logo-icon">
            <Sparkles size={18} />
          </span>
          Java Master Path
        </Link>
        <div className="navbar-links">
          <a href="#features">Características</a>
          <Link href="/auth/signin" className="btn btn-primary">
            Iniciar sesión
          </Link>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="badge">
              <Sparkles size={14} /> Impulsado por IA
            </span>
            <h1>Master Java with AI</h1>
            <p className="subtitle">
              The ultimate platform for university students. Learn Java through an adaptive
              Machine Learning tutor that evolves with your progress.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signin" className="btn btn-primary">
                Get Started
              </Link>
              <a
                href="#features"
                className="btn"
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              >
                View Curriculum
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container" style={{ padding: '5rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
          Why choose our platform?
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 3rem' }}>
          Everything you need to go from zero to confident Java developer, built for the classroom
          and beyond.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="glass-card">
            <div className="feature-icon">
              <Brain size={24} />
            </div>
            <h3 style={{ marginBottom: '0.75rem', color: '#818cf8' }}>AI-Powered Learning</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Our ML model analyzes your code and mistakes, providing personalized hints and exercises
              tailored to your current level.
            </p>
          </div>
          <div className="glass-card">
            <div className="feature-icon">
              <MessagesSquare size={24} />
            </div>
            <h3 style={{ marginBottom: '0.75rem', color: '#818cf8' }}>Interactive Java Tutor</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Chat with an intelligent assistant that doesn&apos;t just give answers, but guides you
              to find the solution yourself.
            </p>
          </div>
          <div className="glass-card">
            <div className="feature-icon">
              <GraduationCap size={24} />
            </div>
            <h3 style={{ marginBottom: '0.75rem', color: '#818cf8' }}>University Grade</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Designed specifically for USAC curriculum and computer science students to master
              the fundamentals of Java and OOP.
            </p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>© 2026 Java Learning Platform. Built for Computer Science Excellence.</p>
          <div className="site-footer-links">
            <a href="#features">Características</a>
            <Link href="/auth/signin">Iniciar sesión</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
