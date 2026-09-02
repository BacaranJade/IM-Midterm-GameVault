import { useCallback, useEffect, useState } from 'react'
import GameCard from '../components/GameCard.jsx'
import { gameApi, GENRES, PLATFORMS } from '../services/gameApi.js'

export default function Games() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [platform, setPlatform] = useState('')
  const [sort, setSort] = useState('title')

  const load = useCallback(() => {
    setLoading(true)
    setError('')
    gameApi
      .getGames({ search, genre, platform, sort })
      .then((data) => {
        setGames(data.data || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [search, genre, platform, sort])

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])

  return (
    <div className="page">
      <div className="page-head">
        <h1>Game Library</h1>
        <p>{games.length} game{games.length === 1 ? '' : 's'} in your collection.</p>
      </div>

      <div className="filters">
        <input
          className="search-input"
          type="search"
          placeholder="Search games…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="">Platform</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="title">Sort: Title</option>
          <option value="rating">Sort: Rating</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading…</div>
      ) : games.length === 0 ? (
        <div className="empty">
          <p>No games match your filters.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}