import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Games from './pages/Games.jsx'
import AddGame from './pages/AddGame.jsx'
import GameDetails from './pages/GameDetails.jsx'
import EditGame from './pages/EditGame.jsx'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/add" element={<AddGame />} />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route path="/games/:id/edit" element={<EditGame />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}