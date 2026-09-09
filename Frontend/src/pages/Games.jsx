import { useCallback, useEffect, useState } from 'react'
import GameCard from '../components/GameCard.jsx'
import { gameApi, GENRES, PLATFORMS } from '../services/gameApi.js'

export default function Games() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [platform, setPlatform] = useState('')
  const [sort, setSort] = useState('title')

  const fetchGames = useCallback((params) => {
    // Only trigger full loading state on the initial request if no games are rendered
    setGames((currentGames) => {
      if (currentGames.length === 0) {
        setLoading(true)
      }
      return currentGames
    })
    
    setError('')
    gameApi
      .getGames(params)
      .then((data) => {
        const gameList = Array.isArray(data) ? data : data?.data || []
        setGames(gameList)
      })
      .catch((e) => setError(e?.message || 'Failed to load games.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGames({ search, genre, platform, sort })
    }, 250)

    return () => clearTimeout(timer)
  }, [search, genre, platform, sort, fetchGames])

  const handleStatusChange = async (gameId, newStatus) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.id === gameId ? { ...game, status: newStatus } : game
      )
    )

    try {
      if (gameApi.updateGame) {
        await gameApi.updateGame(gameId, { status: newStatus })
      }
    } catch (err) {
      console.error('Failed to update game status:', err)
      fetchGames({ search, genre, platform, sort })
    }
  }

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

      {loading && games.length === 0 ? (
        <div className="empty">
          <p>Loading games...</p>
        </div>
      ) : games.length === 0 ? (
        <div className="empty">
          <p>No games match your filters.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {games.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onStatusChange={handleStatusChange} 
            />
          ))}
        </div>
      )}
    </div>
  )
}