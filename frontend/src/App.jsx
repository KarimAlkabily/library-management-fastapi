import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { BooksList } from './components/BooksList.jsx'
import { AuthPanel } from './components/AuthPanel.jsx'
import { HistoryPanel } from './components/HistoryPanel.jsx'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [activeTab, setActiveTab] = useState('books')

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const authValue = useMemo(() => ({ token, setToken }), [token])

  return (
    <>
      <div className="appShell">
        <header className="topbar">
          <div className="brand">
            <div className="brandMark" aria-hidden="true" />
            <div className="brandText">
              <div className="brandTitle">Library</div>
              <div className="brandSub">Books • Borrow • History</div>
            </div>
          </div>

          <nav className="tabs" aria-label="Primary">
            <button
              type="button"
              className={activeTab === 'books' ? 'tab tabActive' : 'tab'}
              onClick={() => setActiveTab('books')}
            >
              Books
            </button>
            <button
              type="button"
              className={activeTab === 'history' ? 'tab tabActive' : 'tab'}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
            <button
              type="button"
              className={activeTab === 'auth' ? 'tab tabActive' : 'tab'}
              onClick={() => setActiveTab('auth')}
            >
              Account
            </button>
          </nav>

          <div className="session">
            <span className={token ? 'pill pillOk' : 'pill'}>{token ? 'Signed in' : 'Guest'}</span>
            {token ? (
              <button type="button" className="btn btnGhost" onClick={() => setToken('')}>
                Logout
              </button>
            ) : null}
          </div>
        </header>

        <main className="content">
          {activeTab === 'books' ? <BooksList token={authValue.token} /> : null}
          {activeTab === 'history' ? <HistoryPanel token={authValue.token} /> : null}
          {activeTab === 'auth' ? <AuthPanel token={authValue.token} setToken={authValue.setToken} /> : null}
        </main>

        <footer className="footer">
          <span className="muted">
            API: <code>http://127.0.0.1:8001</code>
          </span>
        </footer>
      </div>
    </>
  )
}

export default App
