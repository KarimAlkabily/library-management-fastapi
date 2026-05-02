/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { api } from '../api.js'
import './AuthPanel.css'

export function AuthPanel({ token, setToken }) {
  const [mode, setMode] = useState('login') // login | register
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  useEffect(() => {
    setError('')
    setOk('')
  }, [mode])

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setOk('')
    try {
      if (mode === 'login') {
        const res = await api.login({ email, password })
        const t = res?.access_token || ''
        if (!t) throw new Error('No token returned')
        setToken(t)
        setOk('Logged in successfully')
      } else {
        await api.register({ username, email, password })
        setOk('Registered successfully. دلوقتي اعمل Login.')
        setMode('login')
      }
    } catch (err) {
      setError(err?.message || 'Request failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="authPage">
      <div className="authHeader">
        <div>
          <h2 className="authTitle">Account</h2>
          <p className="authSub">Login/Register علشان Borrow/Return و History</p>
        </div>
        <div className="authMode">
          <button
            type="button"
            className={mode === 'login' ? 'modeBtn modeActive' : 'modeBtn'}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'modeBtn modeActive' : 'modeBtn'}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
      </div>

      <div className="authCard">
        {token ? (
          <div className="signedIn">
            <div className="signedInTitle">You’re signed in.</div>
            <div className="signedInSub">لو عايز تخرج اضغط Logout من فوق.</div>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            {mode === 'register' ? (
              <label className="field">
                <span className="label">Username</span>
                <input
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>
            ) : null}

            <label className="field">
              <span className="label">Email</span>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                type="email"
                required
              />
            </label>

            <label className="field">
              <span className="label">Password</span>
              <input
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
              />
            </label>

            {error ? <div className="notice noticeErr">{error}</div> : null}
            {ok ? <div className="notice noticeOk">{ok}</div> : null}

            <button type="submit" className="submit" disabled={busy}>
              {busy ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

