import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Games from './pages/Games.jsx'
import AddGame from './pages/AddGame.jsx'
import GameDetails from './pages/GameDetails.jsx'
import EditGame from './pages/EditGame.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

export default function App() {
  const [games, setGames] = useState([])
  const [playingWarning, setPlayingWarning] = useState(null)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('auth_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const getSavedStatuses = () => {
    try {
      return JSON.parse(localStorage.getItem('game_statuses') || '{}')
    } catch {
      return {}
    }
  }

  const fetchGames = () => {
    const token = localStorage.getItem('auth_token')
    
    fetch('http://127.0.0.1:8000/api/games', {
      headers: {
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const rawGames = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        const savedStatuses = getSavedStatuses()

        const mergedGames = rawGames.map((game) => ({
          ...game,
          status: savedStatuses[game.id] || game.status || 'Wishlist',
        }))

        setGames(mergedGames)
      })
      .catch((err) => console.error('Error fetching games:', err))
  }

  useEffect(() => {
    if (user) {
      fetchGames()
    }
  }, [user])

  const handleLoginSuccess = (userData, token) => {
    setUser(userData)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    if (token) {
      localStorage.setItem('auth_token', token)
    }
    fetchGames()
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    setGames([])
  }

  const handleStatusChange = (gameId, newStatus) => {
    if (newStatus === 'Playing') {
      const currentlyPlaying = games.find(
        (g) => g.status === 'Playing' && g.id !== gameId
      )

      if (currentlyPlaying) {
        setPlayingWarning(
          `You are currently playing "${currentlyPlaying.title}". Please pause the game before setting another game to "Playing".`
        )
        return
      }
    }

    setGames((prevGames) =>
      prevGames.map((game) =>
        game.id === gameId ? { ...game, status: newStatus } : game
      )
    )

    const currentSaved = getSavedStatuses()
    currentSaved[gameId] = newStatus
    localStorage.setItem('game_statuses', JSON.stringify(currentSaved))

    const token = localStorage.getItem('auth_token')
    fetch(`http://127.0.0.1:8000/api/games/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: newStatus }),
    }).catch((err) => console.error('Failed to sync status:', err))
  }

  // If user is not logged in, show only the Login/Register screens full screen without sidebar/navbar clutter
  if (!user) {
    return (
      <div style={{ background: '#0b0b14', minHeight: '100vh', color: '#fff' }}>
        <Routes>
          <Route
            path="/register"
            element={<Register onRegisterSuccess={handleLoginSuccess} />}
          />
          <Route
            path="*"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
        </Routes>
      </div>
    )
  }

  return (
    <div className="app" style={{ background: '#0b0b14', minHeight: '100vh', color: '#fff' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="layout" style={{ display: 'flex' }}>
        <Sidebar user={user} />
        <main className="content" style={{ flex: 1, padding: '2rem' }}>
          <Routes>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route 
              path="/" 
              element={<Dashboard games={games} onStatusChange={handleStatusChange} />} 
            />
            <Route 
              path="/games" 
              element={<Games games={games} onStatusChange={handleStatusChange} />} 
            />
            <Route 
              path="/games/add" 
              element={<AddGame onGameAdded={fetchGames} />} 
            />
            <Route 
              path="/games/:id/edit" 
              element={<EditGame onGameUpdated={fetchGames} />} 
            />
            <Route 
              path="/games/:id" 
              element={<GameDetails onStatusChange={handleStatusChange} />} 
            />
          </Routes>
        </main>
      </div>

      {/* Custom Centered Warning Modal */}
      {playingWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e1e2f',
            border: '1px solid #2a2a40',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            color: '#fff'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#f56565', fontSize: '1.25rem' }}>⚠️ Action Required</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {playingWarning}
            </p>
            <button
              onClick={() => setPlayingWarning(null)}
              style={{
                background: '#3182ce',
                color: '#fff',
                border: 'none',
                padding: '0.65rem 1.5rem',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'background 0.2s'
              }}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  )
}