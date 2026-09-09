import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register({ onRegisterSuccess }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.')
      }

      onRegisterSuccess(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#1e1e2f', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', color: '#fff', border: '1px solid #2a2a40' }}>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 'bold', textAlign: 'center', color: '#fff' }}>Create Account</h2>
        <p style={{ color: '#a0aec0', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>Join GameVault to manage your game library</p>

        {error && (
          <div style={{ background: '#fed7d7', color: '#9b2c2c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem', border: '1px solid #feb2b2' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e0', fontWeight: '500' }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Test User"
              required
              style={{ width: '100%', padding: '0.75rem 1rem', background: '#12121c', border: '1px solid #2d3748', borderRadius: '6px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e0', fontWeight: '500' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              required
              style={{ width: '100%', padding: '0.75rem 1rem', background: '#12121c', border: '1px solid #2d3748', borderRadius: '6px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#cbd5e0', fontWeight: '500' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '0.75rem 1rem', background: '#12121c', border: '1px solid #2d3748', borderRadius: '6px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.75rem', background: loading ? '#4a5568' : '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#a0aec0' }}>
          Already have an account? <Link to="/login" style={{ color: '#3182ce', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}