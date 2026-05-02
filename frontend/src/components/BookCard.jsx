import './BookCard.css'

export function BookCard({ book, token, onBorrow, onReturn, busy }) {
  const id = book?.id ?? book?.book_id
  const title = book?.title ?? book?.name ?? 'Untitled'
  const author = book?.author ?? 'Unknown author'
  const category = book?.category ?? book?.genre ?? null
  const year = book?.year ?? book?.published_year ?? null

  return (
    <article className="bookCard">
      <div className="bookTop">
        <div className="bookCover" aria-hidden="true">
          <div className="bookSpine" />
        </div>
        <div className="bookMeta">
          <h3 className="bookTitle" title={title}>
            {title}
          </h3>
          <div className="bookAuthor">{author}</div>
          <div className="bookTags">
            {category ? <span className="tag">{category}</span> : null}
            {year ? <span className="tag tagSoft">{year}</span> : null}
            {id !== undefined ? <span className="tag tagSoft">#{id}</span> : null}
          </div>
        </div>
      </div>

      <div className="bookActions">
        {token ? (
          <>
            <button
              type="button"
              className="btnCard btnPrimary"
              onClick={() => onBorrow?.(id)}
              disabled={busy || id === undefined}
            >
              Borrow
            </button>
            <button
              type="button"
              className="btnCard"
              onClick={() => onReturn?.(id)}
              disabled={busy || id === undefined}
            >
              Return
            </button>
          </>
        ) : (
          <div className="hint">Login علشان تقدر تعمل Borrow/Return</div>
        )}
      </div>
    </article>
  )
}

