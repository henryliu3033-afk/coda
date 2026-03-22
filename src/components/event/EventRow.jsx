import { Link } from 'react-router'
import { motion } from 'motion/react'
import { fmtShort } from '../../constants/events'

export default function EventRow({ event, index = 0 }) {
  const { mon, day, wd } = fmtShort(event.date)
  const minPrice = Math.min(...event.tickets.map(t => t.price))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.25, delay: index * 0.04 }}>
      <Link to={`/event/${event.id}`}
        className="event-row"
        style={{
          gridTemplateColumns: '64px 1fr auto',
        }}>

        {/* Date block */}
        <div className="flex flex-col items-start leading-none flex-shrink-0">
          <span className="text-xl font-medium tracking-widest uppercase" style={{ color: 'var(--amber)' }}>{mon}</span>
          <span className="text-5xl font-light mt-0.5" style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>{day}</span>
          <span className="text-xl mt-0.5" style={{ color: 'var(--muted)' }}>{wd}</span>
        </div>

        {/* Info */}
        <div className="min-w-0 pl-4 md:pl-6">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-3xl md:text-4xl font-medium" style={{ color: 'var(--text)' }}>
              {event.artist}
            </h3>
            {event.soldOut && (
              <span className="tag text-xl px-1.5 py-0.5" style={{ color: 'var(--muted)', borderColor: 'var(--border2)' }}>
                Sold Out
              </span>
            )}
          </div>
          <p className="text-2xl" style={{ color: 'var(--muted)' }}>
            {event.tour}
          </p>
          <p className="text-xl mt-1 hidden sm:block" style={{ color: 'var(--faint)' }}>
            {event.venue} · Doors {event.doors}
          </p>
        </div>

        {/* Right: price + arrow */}
        <div className="flex flex-col items-end justify-center flex-shrink-0 pl-4">
          {event.soldOut ? (
            <span className="text-2xl" style={{ color: 'var(--faint)' }}>—</span>
          ) : (
            <span className="text-2xl font-medium" style={{ color: 'var(--text)' }}>
              NT${minPrice.toLocaleString()}+
            </span>
          )}
          <span className="text-4xl mt-1" style={{ color: 'var(--faint)' }}>→</span>
        </div>
      </Link>
    </motion.div>
  )
}
