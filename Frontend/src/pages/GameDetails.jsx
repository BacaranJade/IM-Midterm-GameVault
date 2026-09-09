import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Stars } from '../components/GameCard.jsx'
import DeleteModal from '../components/DeleteModal.jsx'
import { gameApi } from '../services/gameApi.js'

export default function GameDetails({ onStatusChange }) {
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
      .then((res) => {
        // Unwrap API wrapper if backend returns `{ data: { ... } }`
        const gameData = res?.data || res
        setGame(gameData)
      })
      .catch((e) => setError(e?.message || 'Failed to fetch game details.'))
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

  if (loading) return <div className="loading" style={{ padding: '40px', color: '#fff' }}>Loading…</div>

  if (error || !game)
    return (
      <div className="page" style={{ padding: '30px' }}>
        <div className="alert alert-error">{error || 'Game not found.'}</div>
        <Link to="/games" className="btn btn-outline" style={{ marginTop: '15px', display: 'inline-block' }}>
          &larr; Back to library
        </Link>
      </div>
    )

  return (
    <div className="page" style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Container with explicit 2-column CSS Grid layout */}
      <div
        className="details-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '32px',
          alignItems: 'start',
          background: '#161522',
          padding: '28px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Cover Artwork Container */}
        <div
          className="details-cover"
          style={{
            width: '100%',
            aspectRatio: '3 / 4',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#222130',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {game.cover_url ? (
            <img
              src={game.cover_url}
              alt={game.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div className="cover cover-lg" style={{ fontSize: '3rem', fontWeight: 'bold', color: '#888' }}>
              <span>{game.title?.charAt(0)?.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="details-info" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', margin: '0 0 12px 0', color: '#fff' }}>{game.title}</h1>

            <div className="details-meta" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              {game.genre && <span className="badge">{game.genre}</span>}
              {game.platform && <span className="badge badge-outline">{game.platform}</span>}
              <span className={`status status-${(game.status || 'wishlist').toLowerCase()}`}>
                {game.status}
              </span>
            </div>
          </div>

          <div className="details-rating" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Stars rating={game.rating} />
            <span className="rating-value" style={{ color: '#aaa', fontSize: '0.95rem' }}>
              {(Number(game.rating) || 0).toFixed(1)} / 5
            </span>
          </div>

          <dl
            className="details-list"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              background: '#1f1e2e',
              padding: '16px',
              borderRadius: '10px',
              margin: 0,
            }}
          >
            <div>
              <dt style={{ color: '#888', fontSize: '0.85rem', marginBottom: '4px' }}>Developer</dt>
              <dd style={{ margin: 0, fontWeight: '600', color: '#fff' }}>{game.developer || '—'}</dd>
            </div>
            <div>
              <dt style={{ color: '#888', fontSize: '0.85rem', marginBottom: '4px' }}>Release year</dt>
              <dd style={{ margin: 0, fontWeight: '600', color: '#fff' }}>{game.release_year || '—'}</dd>
            </div>
          </dl>

          {game.description && (
            <div className="details-desc">
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>About</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
                {game.description}
              </p>
            </div>
          )}

          <div className="details-actions" style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
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