import { useRef } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { EVENTS, getFeatured } from '../constants/events'
import EventRow from '../components/event/EventRow'

export default function Home() {
  const featured = getFeatured()[0]
  const upcoming = EVENTS.filter(e => new Date(e.date) > new Date())

  return (
    <div className="page-in">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ height: '100svh', minHeight: '560px' }}>
        <img src={featured.img} alt={featured.artist}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.45 }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.7) 60%, var(--bg) 100%)' }} />

        <div className="relative wrap flex flex-col justify-end h-full pb-12 md:pb-20" style={{ paddingTop: '80px' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
            <p className="text-xl font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--amber)' }}>
              Featured
            </p>
            <h1 className="font-light leading-none mb-3 text-7xl sm:text-9xl md:text-8xl lg:text-9xl"
              style={{ fontFamily: 'var(--serif)', color: 'var(--text)', letterSpacing: '-0.01em' }}>
              {featured.artist}
            </h1>
            <p className="text-3xl md:text-4xl mb-6 md:mb-8" style={{ color: 'rgba(240,237,230,0.65)' }}>
              {featured.tour} — {featured.venue}
            </p>
            <div className="flex items-center gap-4">
              <Link to={`/event/${featured.id}`} className="btn btn-amber">
                Get Tickets
              </Link>
              <Link to="/events" className="btn">
                All Events
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
            style={{ width: '1px', height: '40px', background: 'var(--border2)', margin: '0 auto' }} />
        </motion.div>
      </section>

      {/* ── Upcoming events list ── */}
      <section className="wrap py-12 md:py-20">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-xl font-medium tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
            Upcoming
          </h2>
          <Link to="/events" className="text-xl tracking-wider uppercase transition-colors"
            style={{ color: 'var(--faint)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--faint)'}>
            View all →
          </Link>
        </div>

        <div>
          {upcoming.slice(0, 6).map((e, i) => (
            <EventRow key={e.id} event={e} index={i} />
          ))}
          {/* Last rule */}
          <div style={{ borderTop: '1px solid var(--border)' }} />
        </div>
      </section>

      {/* ── Simple text CTA ── */}
      <section className="wrap pb-16 md:pb-24">
        <div className="py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ borderTop: '1px solid var(--border)' }}>
          <div>
            <h2 className="font-light text-5xl md:text-7xl mb-3"
              style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>
              Never miss a show.
            </h2>
            <p className="text-2xl" style={{ color: 'var(--muted)' }}>
              訂閱演出通知，第一時間取得票務資訊。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-0 max-w-lg">
            <input type="email" placeholder="your@email.com"
              className="field flex-1 text-2xl" style={{ borderRight: 'none' }} />
            <button className="btn btn-amber text-xl px-5 flex-shrink-0">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  )
}
