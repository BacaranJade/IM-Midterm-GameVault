import GameForm from '../components/GameForm.jsx'
import { gameApi } from '../services/gameApi.js'

export default function AddGame() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>Add a Game</h1>
        <p>Add a new game to your collection.</p>
      </div>

      <div className="panel">
        <GameForm
          submitLabel="Add Game"
          onSubmit={(form) => gameApi.createGame(form)}
        />
      </div>
    </div>
  )
}