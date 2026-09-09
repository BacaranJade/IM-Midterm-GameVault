import React from 'react'
import { Link } from 'react-router-dom'

export function Stars({ rating = 0 }) {
  const stars = []
  const score = Math.min(5, Math.max(0, Number(rating) || 0))
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= score ? '#ffb400' : '#444', fontSize: '0.9rem' }}>
        ★
      </span>
    )
  }
  return <div style={{ display: 'inline-flex', gap: '2px' }}>{stars}</div>
}

export default function GameCard({ game, onStatusChange }) {
  const statusOptions = [
    { value: 'wishlist', label: 'Wishlist' },
    { value: 'playing', label: 'Playing' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
    { value: 'backlog', label: 'Backlog' },
  ]

  const currentStatus = (game.status || 'wishlist').toLowerCase()

  return (
    <div
      style={{
        background: '#161522',
        borderRadius: '12px',
        border: '1px solid #282738',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <div>
        {/* Uniform Image Ratio */}
        <Link to={`/games/${game.id}`} style={{ display: 'block', textDecoration: 'none' }}>
          <div
            style={{
              width: '100%',
              height: '160px',
              background: '#222130',
              overflow: 'hidden',
              position: 'relative',
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
                  objectPosition: 'center',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                {game.title?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
        </Link>

        {/* Details Section */}
        <div style={{ padding: '14px' }}>
          <Link
            to={`/games/${game.id}`}
            style={{ textDecoration: 'none', color: '#fff' }}
          >
            <h3
              style={{
                margin: '0 0 6px 0',
                fontSize: '1rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={game.title}
            >
              {game.title}
            </h3>
          </Link>

          <div
            style={{
              display: 'flex',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#8a8d93',
              marginBottom: '10px',
            }}
          >
            <span>{game.genre || 'N/A'}</span>
            <span>•</span>
            <span>{game.platform || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Status Selector Footer */}
      <div style={{ padding: '0 14px 14px 14px' }}>
        <select
          value={currentStatus}
          onChange={(e) => onStatusChange && onStatusChange(game.id, e.target.value)}
          style={{
            width: '100%',
            background: '#222130',
            color: '#fff',
            border: '1px solid #38364d',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}