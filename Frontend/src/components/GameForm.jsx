import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GENRES, PLATFORMS, STATUSES } from '../services/gameApi.js'

const safeGenres = Array.isArray(GENRES) ? GENRES : ['Action', 'Adventure', 'RPG', 'Platformer', 'Other']
const safePlatforms = Array.isArray(PLATFORMS) ? PLATFORMS : ['PC', 'Nintendo Switch', 'PlayStation 5', 'Xbox']
const safeStatuses = Array.isArray(STATUSES) ? STATUSES : ['Wishlist', 'Playing', 'Completed', 'Paused']

const emptyForm = {
  title: '',
  genre: '',
  platform: '',
  developer: '',
  release_year: '',
  rating: '',
  status: 'Wishlist',
  cover_url: '',
  description: '',
}

export default function GameForm({ initial, onSubmit, submitLabel = 'Submit' }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        genre: initial.genre || '',
        platform: initial.platform || '',
        developer: initial.developer || '',
        release_year: initial.release_year || '',
        rating: initial.rating || '',
        status: initial.status || 'Wishlist',
        cover_url: initial.cover_url || '',
        description: initial.description || '',
      })
    }
  }, [initial])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit(form)
      navigate('/games')
    } catch (err) {
      setError(err?.message || 'An error occurred while saving.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="game-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-section">
        <div className="form-grid">
          <label className="field field-wide">
            <span>Title *</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Elden Ring"
              required
            />
          </label>

          <label className="field">
            <span>Genre *</span>
            <select name="genre" value={form.genre} onChange={handleChange} required>
              <option value="" disabled hidden>
                Select Genre
              </option>
              {safeGenres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Platform *</span>
            <select name="platform" value={form.platform} onChange={handleChange} required>
              <option value="" disabled hidden>
                Select Platform
              </option>
              {safePlatforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Developer</span>
            <input
              name="developer"
              value={form.developer}
              onChange={handleChange}
              placeholder="e.g. FromSoftware"
            />
          </label>

          <label className="field">
            <span>Release Year</span>
            <input
              name="release_year"
              type="number"
              value={form.release_year}
              onChange={handleChange}
              placeholder="e.g. 2022"
            />
          </label>

          <label className="field">
            <span>Rating</span>
            <input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={form.rating}
              onChange={handleChange}
              placeholder="e.g. 4.5"
            />
          </label>

          <label className="field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              {safeStatuses.map((s) => {
                const val = typeof s === 'object' ? s.value : s
                const lbl = typeof s === 'object' ? s.label : s
                return <option key={val} value={val}>{lbl}</option>
              })}
            </select>
          </label>

          <label className="field field-wide">
            <span>Cover Image URL</span>
            <input
              name="cover_url"
              value={form.cover_url}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
            />
          </label>

          <label className="field field-wide">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description or notes about the game..."
              rows="4"
            />
          </label>
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}