import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Stars } from '../components/GameCard.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import { gameApi } from '../services/gameApi.js'

export default function GameDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    gameApi
      .getGame(id)
      .then(setGame)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    try {
      await gameApi.deleteGame(id)
      navigate('/games')
    } catch (e) {
      setError(e.message)
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading) return <div className="loading">Loading…</div>

  if (error || !game)
    return (
      <div className="page">
        <div className="alert alert-error">{error || 'Game not found.'}</div>
        <Link to="/games" className="btn btn-outline">Back to library</Link>
      </div>
    )

  return (
    <div className="page">
      <div className="details-layout">
        <div className="details-cover">
          {game.cover_url ? (
            <img src={game.cover_url} alt={game.title} />
          ) : (
            <div className="cover cover-lg">
              <span>{game.title.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        <div className="details-info">
          <h1>{game.title}</h1>
          <div className="details-meta">
            <span className="badge">{game.genre}</span>
            <span className="badge badge-outline">{game.platform}</span>
            <span className={`status status-${game.status}`}>{game.status}</span>
          </div>
          <div className="details-rating">
            <Stars rating={game.rating} />
            <span className="rating-value">
              {(Number(game.rating) || 0).toFixed(1)} / 5
            </span>
          </div>

          <dl className="details-list">
            <div>
              <dt>Developer</dt>
              <dd>{game.developer || '—'}</dd>
            </div>
            <div>
              <dt>Release year</dt>
              <dd>{game.release_year || '—'}</dd>
            </div>
          </dl>

          {game.description && (
            <div className="details-desc">
              <h3>About</h3>
              <p>{game.description}</p>
            </div>
          )}

          <div className="details-actions">
            <Link to={`/games/${game.id}/edit`} className="btn btn-primary">
              Edit
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </button>
            <Link to="/games" className="btn btn-ghost">
              Back to library
            </Link>
          </div>
        </div>
      </div>

      <DeleteModal
        open={confirmOpen}
        game={game}
        deleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}