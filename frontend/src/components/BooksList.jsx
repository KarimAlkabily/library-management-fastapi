/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'
import { BookCard } from './BookCard.jsx'
import './BooksList.css'

export function BooksList({ token }) {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionBusy, setActionBusy] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')
    api
      .getBooks()
      .then((data) => {
        if (!alive) return
        setBooks(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        if (!alive) return
        setError(e?.message || 'Failed to load books')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return books
    return books.filter((b) => {
      const title = String(b?.title ?? b?.name ?? '').toLowerCase()
      const author = String(b?.author ?? '').toLowerCase()
      const category = String(b?.category ?? b?.genre ?? '').toLowerCase()
      return title.includes(q) || author.includes(q) || category.includes(q)
    })
  }, [books, query])

  async function onBorrow(bookId) {
    if (!token) return
    setActionBusy(true)
    setError('')
    try {
      await api.borrow({ token, book_id: bookId })
      setToast('Borrowed successfully')
    } catch (e) {
      setError(e?.message || 'Borrow failed')
    } finally {
      setActionBusy(false)
    }
  }

  async function onReturn(bookId) {
    if (!token) return
    setActionBusy(true)
    setError('')
    try {
      await api.returnBook({ token, book_id: bookId })
      setToast('Returned successfully')
    } catch (e) {
      setError(e?.message || 'Return failed')
    } finally {
      setActionBusy(false)
    }
  }

  return (
    <section className="booksPage">
      <div className="pageHeader">
        <div>
          <h2 className="pageTitle">Books</h2>
          <p className="pageSub">ابحث واعمل Borrow/Return (لازم تكون عامل Login)</p>
        </div>
        <div className="searchBox">
          <input
            className="searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, category..."
            aria-label="Search books"
          />
        </div>
      </div>

      {toast ? <div className="toast">{toast}</div> : null}
      {error ? <div className="alert alertErr">{error}</div> : null}

      {loading ? (
        <div className="grid">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : filtered.length ? (
        <div className="grid">
          {filtered.map((b) => (
            <BookCard
              key={b.id ?? `${b.title}-${b.author}`}
              book={b}
              token={token}
              onBorrow={onBorrow}
              onReturn={onReturn}
              busy={actionBusy}
            />
          ))}
        </div>
      ) : (
        <div className="empty">No books found.</div>
      )}
    </section>
  )
}

