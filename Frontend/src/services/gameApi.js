const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('auth_token')

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    // Automatically convert status to lowercase to match Laravel validation
    const payload = {
      ...game,
      status: game.status ? game.status.toLowerCase() : undefined,
    }
    return request('/games', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  updateGame(id, game) {
    // Automatically convert status to lowercase to match Laravel validation
    const payload = {
      ...game,
      status: game.status ? game.status.toLowerCase() : undefined,
    }
    return request(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
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