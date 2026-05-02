export const API_BASE_URL = 'http://127.0.0.1:8001'

async function readJsonSafe(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiRequest(path, { method = 'GET', token, body, query } = {}) {
  const url = new URL(API_BASE_URL + path)
  if (query && typeof query === 'object') {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null || v === '') continue
      url.searchParams.set(k, String(v))
    }
  }

  const headers = { Accept: 'application/json' }
  let payload = undefined

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: payload,
  })

  const data = await readJsonSafe(res)
  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'detail' in data && data.detail) ||
      (typeof data === 'string' && data) ||
      `Request failed (${res.status})`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export const api = {
  getBooks: () => apiRequest('/books'),
  login: (body) => apiRequest('/login', { method: 'POST', body }),
  register: (body) => apiRequest('/register', { method: 'POST', body }),
  borrow: ({ token, book_id }) =>
    apiRequest('/borrow', { method: 'POST', token, query: { book_id } }),
  returnBook: ({ token, book_id }) =>
    apiRequest('/borrow/return', { method: 'POST', token, query: { book_id } }),
  history: ({ token }) => apiRequest('/history', { token }),
}

