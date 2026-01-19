import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1>Master Java with AI</h1>
            <p className="subtitle">
              The ultimate platform for university students. Learn Java through an adaptive 
              Machine Learning tutor that evolves with your progress.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/auth/signin" className="btn btn-primary">
                Get Started
              </Link>
              <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
                View Curriculum
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Why choose our platform?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem', color: '#818cf8' }}>AI-Powered Learning</h3>
            <p color="var(--text-muted)">
              Our ML model analyzes your code and mistakes, providing personalized hints and exercises 
              tailored to your current level.
            </p>
          </div>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem', color: '#818cf8' }}>Interactive Java Tutor</h3>
            <p color="var(--text-muted)">
              Chat with an intelligent assistant that doesn't just give answers, but guides you 
              to find the solution yourself.
            </p>
          </div>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem', color: '#818cf8' }}>University Grade</h3>
            <p color="var(--text-muted)">
              Designed specifically for USAC curriculum and computer science students to master 
              the fundamentals of Java and OOP.
            </p>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
        <p>© 2026 Java Learning Platform. Built for Computer Science Excellence.</p>
      </footer>
    </main>
  );
}
