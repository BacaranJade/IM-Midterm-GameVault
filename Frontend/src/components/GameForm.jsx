import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gameApi, GENRES, PLATFORMS, STATUSES } from '../services/gameApi.js'

const empty = {
  title: '',
  genre: '',
  platform: '',
  developer: '',
  release_year: '',
  rating: '',
  status: 'wishlist',
  cover_url: '',
  description: '',
}

export default function GameForm({ initial, onSubmit, submitLabel }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...empty, ...(initial || {}) })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

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
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="game-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-section">
        <h3>About the game</h3>
        <div className="form-grid">
          <label className="field field-wide">
            <span>Title *</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Elden Ring"
            />
          </label>

          <label className="field">
            <span>Genre *</span>
            <select name="genre" value={form.genre} onChange={handleChange} required>
              <option value="">Select genre…</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Platform *</span>
            <select name="platform" value={form.platform} onChange={handleChange} required>
              <option value="">Select platform…</option>
              {PLATFORMS.map((p) => (
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
            <span>Release year</span>
            <input
              name="release_year"
              type="number"
              min="1950"
              max="2100"
              value={form.release_year}
              onChange={handleChange}
              placeholder="e.g. 2022"
            />
          </label>

          <label className="field">
            <span>Rating (0–5)</span>
            <input
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
              placeholder="e.g. 4.5"
            />
          </label>

          <label className="field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>

          <label className="field field-wide">
            <span>Cover image URL</span>
            <input
              name="cover_url"
              value={form.cover_url}
              onChange={handleChange}
              placeholder="https://…/cover.jpg (optional)"
            />
          </label>

          <label className="field field-wide">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="A short summary of the game…"
            />
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}