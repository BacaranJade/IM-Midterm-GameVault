import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          GAMEVAULT
        </Link>
        <Link to="/games/add" className="btn btn-primary btn-sm">
          + Add Game
        </Link>
      </div>
    </header>
  )
}