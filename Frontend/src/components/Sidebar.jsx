import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" end>
        Dashboard
      </NavLink>
      <NavLink to="/games">
        Game Library
      </NavLink>
      <NavLink to="/games/add">
        Add Game
      </NavLink>
    </aside>
  )
}
