import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import GameForm from '../components/GameForm.jsx'
import { gameApi } from '../services/gameApi.js'

export default function EditGame() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    gameApi
      .getGame(id)
      .then((res) => {
        // Handle direct game object or Laravel API resource wrapper
        const gameData = res?.data || res
        setGame(gameData)
      })
      .catch((e) => setError(e?.message || 'Failed to load game'))
  }, [id])

  if (error) return <div className="alert alert-error" style={{ padding: '20px' }}>{error}</div>

  if (!game) return <div className="loading" style={{ padding: '20px' }}>Loading…</div>

  return (
    <div className="page">
      <div className="page-head">
        <h1>Edit “{game.title}”</h1>
        <p>Update the game's details.</p>
      </div>

      <div className="panel">
        <GameForm
          initial={game}
          submitLabel="Save Changes"
          onSubmit={async (form) => {
            await gameApi.updateGame(id, form)
            navigate('/games')
          }}
        />
      </div>
    </div>
  )
}