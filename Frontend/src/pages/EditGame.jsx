import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GameForm from '../components/GameForm.jsx'
import { gameApi } from '../services/gameApi.js'

export default function EditGame() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    gameApi
      .getGame(id)
      .then(setGame)
      .catch((e) => setError(e.message))
  }, [id])

  if (error)
    return <div className="alert alert-error">{error}</div>

  if (!game)
    return <div className="loading">Loading…</div>

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
          onSubmit={(form) => gameApi.updateGame(id, form)}
        />
      </div>
    </div>
  )
}