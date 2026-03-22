import { useState, useMemo } from 'react'
import { EVENTS, GENRES } from '../constants/events'
import EventRow from '../components/event/EventRow'

export default function Events() {
  const [genre, setGenre] = useState('All')

  const filtered = useMemo(() => {
    return genre === 'All' ? EVENTS : EVENTS.filter(e => e.genre === genre)
  }, [genre])

  return (
    <div className="page-in" style={{ paddingTop: '60px' }}>

      {/* Header */}
      <div className="wrap pt-10 md:pt-16 pb-6">
        <h1 className="font-light text-6xl md:text-8xl mb-2"
          style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>
          Events
        </h1>
        <p className="text-2xl" style={{ color: 'var(--muted)' }}>
          {filtered.length} upcoming shows
        </p>
      </div>

      {/* Genre filter */}
      <div className="wrap pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(g => (
            <button key={g} onClick={() => setGenre(g)}
              className="btn text-xl px-3 py-1.5 cursor-pointer transition-all"
              style={{
                background:   genre === g ? 'var(--amber)' : 'transparent',
                borderColor:  genre === g ? 'var(--amber)' : 'var(--border)',
                color:        genre === g ? 'var(--black)' : 'var(--muted)',
              }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="wrap pb-20">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-2xl" style={{ color: 'var(--muted)' }}>
            No events for this genre.
          </p>
        ) : (
          <>
            {filtered.map((e, i) => <EventRow key={e.id} event={e} index={i} />)}
            <div style={{ borderTop: '1px solid var(--border)' }} />
          </>
        )}
      </div>
    </div>
  )
}
