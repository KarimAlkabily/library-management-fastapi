/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { api } from '../api.js'
import './HistoryPanel.css'

export function HistoryPanel({ token }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    let alive = true
    setLoading(true)
    setError('')
    api
      .history({ token })
      .then((data) => {
        if (!alive) return
        setItems(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        if (!alive) return
        setError(e?.message || 'Failed to load history')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [token])

  if (!token) {
    return (
      <section className="historyPage">
        <h2 className="historyTitle">History</h2>
        <div className="historyCard">اعمل Login الأول علشان تشوف الـ history.</div>
      </section>
    )
  }

  return (
    <section className="historyPage">
      <div className="historyHeader">
        <div>
          <h2 className="historyTitle">History</h2>
          <p className="historySub">آخر عمليات الـ borrow بتاعتك</p>
        </div>
        <button
          type="button"
          className="refreshBtn"
          onClick={() => {
            // trigger effect by resetting token dependency indirectly is not ideal; do direct fetch:
            setLoading(true)
            setError('')
            api
              .history({ token })
              .then((data) => setItems(Array.isArray(data) ? data : []))
              .catch((e) => setError(e?.message || 'Failed to load history'))
              .finally(() => setLoading(false))
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error ? <div className="historyAlert">{error}</div> : null}

      {items.length ? (
        <div className="historyGrid">
          {items.map((it, idx) => (
            <div key={it?.id ?? `${it?.book_id ?? 'b'}-${idx}`} className="historyItem">
              <div className="historyRow">
                <div className="k">Book</div>
                <div className="v">{it?.book_title ?? it?.title ?? `#${it?.book_id ?? '-'}`}</div>
              </div>
              <div className="historyRow">
                <div className="k">When</div>
                <div className="v">{it?.borrow_date ?? it?.created_at ?? it?.date ?? '—'}</div>
              </div>
              <div className="historyRow">
                <div className="k">Status</div>
                <div className="v">{it?.status ?? 'borrowed'}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="historyCard">{loading ? 'Loading...' : 'No history yet.'}</div>
      )}
    </section>
  )
}

