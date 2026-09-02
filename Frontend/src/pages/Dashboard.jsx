import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GameCard from '../components/GameCard.jsx'
import { gameApi } from '../services/gameApi.js'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    gameApi
      .getGames()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const counts = data?.counts
  const games = data?.data || []

  const stats = counts
    ? [
        { label: 'Games', value: counts.total },
        { label: 'Completed', value: counts.completed },
        { label: 'Playing', value: counts.playing },
        { label: 'Wishlist', value: counts.wishlist },
      ]
    : []

  return (
    <div className="page">
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>Your game collection at a glance.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="section-head">
            <h2>Your Game Collection</h2>
            <Link to="/games" className="btn btn-outline btn-sm">
              View all
            </Link>
          </div>

          {games.length === 0 ? (
            <div className="empty">
              <p>No games yet.</p>
              <Link to="/games/add" className="btn btn-primary">
                Add your first game
              </Link>
            </div>
          ) : (
            <div className="cards-grid">
              {games.slice(0, 8).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}