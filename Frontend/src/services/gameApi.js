const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      data?.message ||
      (data?.errors
        ? Object.values(data.errors).flat().join(', ')
        : data?.error) ||
      `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return data
}

export const gameApi = {
  getGames(params = {}) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString()
    return request(`/games${qs ? `?${qs}` : ''}`)
  },

  getGame(id) {
    return request(`/games/${id}`)
  },

  createGame(game) {
    return request('/games', {
      method: 'POST',
      body: JSON.stringify(game),
    })
  },

  updateGame(id, game) {
    return request(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(game),
    })
  },

  deleteGame(id) {
    return request(`/games/${id}`, { method: 'DELETE' })
  },
}

export const GENRES = [
  'Action',
  'RPG',
  'FPS',
  'Racing',
  'Simulation',
  'Metroidvania',
  'Roguelike',
  'Strategy',
  'Sports',
  'Puzzle',
  'Horror',
  'Other',
]

export const PLATFORMS = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X',
  'Nintendo Switch',
  'Mobile',
]

export const STATUSES = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'playing', label: 'Playing' },
  { value: 'completed', label: 'Completed' },
  { value: 'backlog', label: 'Backlog' },
]