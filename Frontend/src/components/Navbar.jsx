import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogoutClick = async () => {
    const token = localStorage.getItem('auth_token')

    if (token) {
      try {
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (err) {
        console.error('Failed to log out on server:', err)
      }
    }

    onLogout()
    navigate('/login')
  }

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#151521', color: '#fff', borderBottom: '1px solid #22223b' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
           Game<span style={{ color: '#3182ce' }}>Vault</span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {user && (
          <>
            <span style={{ fontSize: '0.9rem', color: '#a0aec0' }}>
              Welcome back, <strong style={{ color: '#fff' }}>{user.name}</strong>
            </span>
            <button
              onClick={handleLogoutClick}
              style={{ padding: '0.5rem 1rem', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}