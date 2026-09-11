import React from 'react'

const API_BASE_URL = 'http://127.0.0.1:8000'

const getImageUrl = (url) => {
  if (!url) return '/placeholder.jpg'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/storage/')) return `${API_BASE_URL}${url}`
  if (url.startsWith('storage/')) return `${API_BASE_URL}/${url}`
  return `${API_BASE_URL}/storage/${url.replace(/^\/+/, '')}`
}

export default function Dashboard({ games = [], onStatusChange }) {
  const safeGames = Array.isArray(games) ? games : []
  const activeGame = safeGames.find((g) => g.status === 'Playing') || safeGames[0]

  return (
    <div 
      className="dashboard-container" 
      style={{ 
        width: '100%', 
        padding: '24px 32px', 
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start'
      }}
    >
      {/* Top Hero and Side Panel Split */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '24px', 
          marginBottom: '32px',
          width: '100%',
          alignItems: 'stretch' // Ensures grid items stretch equally
        }}
      >
        {/* Featured Hero Banner */}
        {activeGame ? (
          <div 
            className="featured-hero"
            style={{ 
              backgroundImage: `url("${getImageUrl(activeGame.cover_url)}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              padding: '32px',
              textAlign: 'left'
            }}
          >
            <div 
              className="featured-overlay" 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15,10,25,0.95) 20%, rgba(15,10,25,0.3) 100%)',
                zIndex: 1
              }}
            />
            <div 
              className="featured-content" 
              style={{ 
                position: 'relative', 
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                maxWidth: '600px'
              }}
            >
              <span 
                className="badge-popular" 
                style={{ 
                  background: '#e63956', 
                  color: '#fff', 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}
              >
                {activeGame.status === 'Playing' ? 'Now Playing' : 'Featured Game'}
              </span>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '2.4rem', color: '#fff', fontWeight: '700' }}>
                {activeGame.title}
              </h1>
              <p style={{ color: '#a093b1', fontSize: '0.9rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>
                {activeGame.description || 'Explore immersive worlds and epic adventures in this title.'}
              </p>
              <button 
                className="btn-primary-action" 
                style={{ 
                  background: '#e63956', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '10px 22px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                {activeGame.status === 'Playing' ? 'Resumed Session' : 'Play Now'}
              </button>
            </div>
          </div>
        ) : (
          <div className="featured-hero" style={{ background: '#1f122e', borderRadius: '16px', padding: '24px' }}>
            <h2>No Games Available</h2>
          </div>
        )}

        {/* In Library Sidebar */}
        <div 
          className="library-panel" 
          style={{ 
            background: '#161124', 
            borderRadius: '16px', 
            padding: '24px', 
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '344px', // Matches height nicely with the hero section
            boxSizing: 'border-box'
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#fff', fontSize: '1.1rem', flexShrink: 0 }}>In Library</h3>
          
          {/* Scrollable Container */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              overflowY: 'auto', 
              paddingRight: '4px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#3a2d54 #161124'
            }}
          >
            {safeGames.map((game) => (
              <div 
                key={game.id} 
                className="library-item" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  background: '#221a35', 
                  padding: '10px 12px', 
                  borderRadius: '8px',
                  flexShrink: 0
                }}
              >
                <img 
                  src={getImageUrl(game.cover_url)} 
                  alt={game.title} 
                  className="library-thumb" 
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {game.title}
                  </div>
                  <div style={{ marginTop: '2px' }}>
                    <span className="genre-tag" style={{ fontSize: '0.75rem', color: '#a093b1' }}>{game.genre || 'Action'}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: '500', color: game.status === 'Playing' ? '#e63956' : '#a093b1' }}>
                  {game.status || 'Wishlist'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Collection Grid */}
      <h3 style={{ marginBottom: '16px', color: '#fff', textAlign: 'left', fontSize: '1.2rem' }}>Your Game Collection</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', width: '100%' }}>
        {safeGames.map((game) => (
          <div 
            key={game.id} 
            className="game-card-redesign"
            style={{
              background: '#161124',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ width: '100%', height: '140px', overflow: 'hidden', background: '#0f0a19' }}>
              <img 
                src={getImageUrl(game.cover_url)} 
                alt={game.title} 
                className="game-card-thumb" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block'
                }}
              />
            </div>

            <div className="game-card-body" style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {game.title}
                </h4>
                <div style={{ marginBottom: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {game.genre && (
                    <span className="genre-tag" style={{ fontSize: '0.72rem', background: '#221a35', color: '#a093b1', padding: '2px 6px', borderRadius: '4px' }}>
                      {game.genre}
                    </span>
                  )}
                  {game.platform && (
                    <span className="genre-tag" style={{ fontSize: '0.72rem', background: '#221a35', color: '#a093b1', padding: '2px 6px', borderRadius: '4px' }}>
                      {game.platform}
                    </span>
                  )}
                </div>
              </div>

              <select
                value={game.status || 'Wishlist'}
                onChange={(e) => onStatusChange(game.id, e.target.value)}
                className="status-dropdown"
                style={{
                  width: '100%',
                  background: '#221a35',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Playing">Playing</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}