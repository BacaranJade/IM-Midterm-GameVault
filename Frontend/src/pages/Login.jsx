import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Invalid login credentials.')
      }

      onLoginSuccess(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'radial-gradient(circle at 50% 20%, #1a1a3a 0%, #0b0b14 70%)', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'rgba(22, 22, 35, 0.85)', backdropFilter: 'blur(12px)', padding: '3rem 2.5rem', borderRadius: '16px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '0.5px', margin: '0 0 0.5rem 0' }}>
             Game<span style={{ color: '#3182ce' }}>Vault</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.925rem', margin: 0 }}>Sign in to manage your gaming library</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              style={{ width: '100%', padding: '0.85rem 1rem', background: '#0f0f18', border: '1px solid #2a2a40', borderRadius: '8px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#3182ce'}
              onBlur={(e) => e.target.style.borderColor = '#2a2a40'}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '0.85rem 1rem', background: '#0f0f18', border: '1px solid #2a2a40', borderRadius: '8px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#3182ce'}
              onBlur={(e) => e.target.style.borderColor = '#2a2a40'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: '0.75rem', padding: '0.9rem', background: loading ? '#4a5568' : 'linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(49, 130, 206, 0.4)', transition: 'filter 0.2s' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.5rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#63b3ed', textDecoration: 'none', fontWeight: '600' }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  )
}