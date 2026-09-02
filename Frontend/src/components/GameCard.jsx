import { Link } from 'react-router-dom'

function Stars({ rating }) {
  const r = Number(rating) || 0
  return (
    <span className="stars" title={`${r.toFixed(1)} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(r) ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </span>
  )
}

export function Cover({ game }) {
  return (
    <div className="cover">
      {game.cover_url ? (
        <img src={game.cover_url} alt={game.title} loading="lazy" />
      ) : (
        <span className="cover-initial">{game.title.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

export default function GameCard({ game }) {
  return (
    <div className="game-card">
      <Cover game={game} />
      <div className="game-card-body">
        <h3 className="game-card-title">{game.title}</h3>
        <div className="game-card-meta">
          <span className="badge">{game.genre}</span>
          <span className="platform">{game.platform}</span>
        </div>
        <div className="game-card-footer">
          <Stars rating={game.rating} />
          <span className={`status status-${game.status}`}>{game.status}</span>
        </div>
        <Link to={`/games/${game.id}`} className="btn btn-outline btn-block">
          View
        </Link>
      </div>
    </div>
  )
}

export { Stars }