import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { getById, fmtDate, EVENTS } from '../constants/events'
import { useCart } from '../store/cart.store'
import EventRow from '../components/event/EventRow'

function StockIndicator({ sold, total }) {
  const pct = Math.min((sold / total) * 100, 100)
  const avail = total - sold
  const out = avail <= 0
  const low = pct >= 85 && !out
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-px overflow-hidden" style={{ background: 'var(--border)' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: out ? 'var(--faint)' : low ? '#E5A535' : 'var(--amber)', transition: 'width .5s' }} />
      </div>
      <span className="text-xl flex-shrink-0" style={{ color: out ? 'var(--faint)' : low ? '#E5A535' : 'var(--muted)' }}>
        {out ? 'Sold out' : low ? `${avail} left` : `${avail} available`}
      </span>
    </div>
  )
}

export default function EventDetail() {
  const { id }     = useParams()
  const event      = getById(id)
  const { add }    = useCart()
  const navigate   = useNavigate()

  const [selId,  setSel]   = useState(null)
  const [qty,    setQty]   = useState(1)
  const [added,  setAdded] = useState(false)

  if (!event) return (
    <div style={{ paddingTop: '60px' }} className="wrap py-24 text-center">
      <p className="text-2xl" style={{ color: 'var(--muted)' }}>Event not found.</p>
      <Link to="/events" className="btn mt-6 inline-flex">Back to Events</Link>
    </div>
  )

  const ticket  = event.tickets.find(t => t.id === selId)
  const related = EVENTS.filter(e => e.id !== id && e.genre === event.genre).slice(0, 3)

  const handleAdd = () => {
    if (!ticket) return
    add(event, ticket, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="page-in" style={{ paddingTop: '60px' }}>

      {/* Hero image — short and wide */}
      <div className="relative overflow-hidden w-full h-56 sm:h-72 md:h-96">
        <img src={event.img} alt={event.artist} className="w-full h-full object-cover"
          style={{ opacity: 0.5 }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 30%, var(--bg) 100%)' }} />
      </div>

      <div className="wrap pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xl py-4 mb-6" style={{ color: 'var(--faint)', borderBottom: '1px solid var(--border)' }}>
          <Link to="/" className="transition-colors hover:text-[var(--text)]" style={{ color: 'var(--faint)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/events" className="transition-colors hover:text-[var(--text)]" style={{ color: 'var(--faint)', textDecoration: 'none' }}>Events</Link>
          <span>/</span>
          <span style={{ color: 'var(--muted)' }}>{event.artist}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Left: event info */}
          <div className="lg:col-span-2">
            <p className="text-xl font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
              {event.genre}
            </p>
            <h1 className="font-light leading-tight mb-1 text-6xl md:text-8xl"
              style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>
              {event.artist}
            </h1>
            <p className="text-3xl mb-8" style={{ color: 'var(--muted)' }}>
              {event.tour}
            </p>

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 pb-10" style={{ borderBottom: '1px solid var(--border)' }}>
              {[
                ['Date',  fmtDate(event.date)],
                ['Venue', event.venue],
                ['Doors', event.doors],
                ['Start', event.start],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xl font-medium tracking-widest uppercase mb-1" style={{ color: 'var(--faint)' }}>{k}</p>
                  <p className="text-2xl" style={{ color: 'var(--text)' }}>{v}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <h2 className="text-xl font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--faint)' }}>About</h2>
            <p className="text-2xl leading-relaxed" style={{ color: 'var(--muted)', maxWidth: '540px' }}>
              {event.about}
            </p>
          </div>

          {/* Right: ticket selector — sticky on desktop, top on mobile */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-20 p-6" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <p className="text-xl font-medium tracking-widest uppercase mb-5" style={{ color: 'var(--muted)' }}>
                Tickets
              </p>

              {event.soldOut ? (
                <div className="py-6 text-center">
                  <p className="text-2xl mb-1" style={{ color: 'var(--muted)' }}>This show is sold out.</p>
                  <Link to="/events" className="btn text-xl mt-4 inline-flex">Browse other events</Link>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3 mb-6">
                    {event.tickets.map(t => {
                      const out = t.sold >= t.total
                      const sel = selId === t.id
                      return (
                        <button key={t.id}
                          disabled={out}
                          onClick={() => !out && setSel(t.id)}
                          className={`ticket-opt text-left transition-all cursor-pointer ${sel ? 'active' : ''}`}
                          style={{ opacity: out ? 0.4 : 1, cursor: out ? 'not-allowed' : 'pointer' }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-2xl font-medium" style={{ color: 'var(--text)' }}>{t.name}</span>
                            <span className="text-2xl font-medium" style={{ color: sel ? 'var(--amber)' : 'var(--text)' }}>
                              NT${t.price.toLocaleString()}
                            </span>
                          </div>
                          <StockIndicator sold={t.sold} total={t.total} />
                        </button>
                      )
                    })}
                  </div>

                  {/* Qty */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-medium tracking-widest uppercase" style={{ color: 'var(--faint)' }}>Qty</span>
                    <div className="flex items-center gap-0" style={{ border: '1px solid var(--border2)' }}>
                      <button onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-9 h-9 flex items-center justify-center text-3xl cursor-pointer transition-colors"
                        style={{ color: 'var(--muted)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>−</button>
                      <span className="w-9 text-center text-2xl font-medium" style={{ color: 'var(--text)' }}>{qty}</span>
                      <button onClick={() => setQty(Math.min(8, qty + 1))}
                        className="w-9 h-9 flex items-center justify-center text-3xl cursor-pointer transition-colors"
                        style={{ color: 'var(--muted)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>+</button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  {ticket && (
                    <div className="flex justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="text-xl font-medium tracking-widest uppercase" style={{ color: 'var(--faint)' }}>Total</span>
                      <span className="text-3xl font-medium" style={{ color: 'var(--text)' }}>
                        NT${(ticket.price * qty).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <button disabled={!selId || added} onClick={handleAdd}
                    className="btn btn-amber w-full cursor-pointer"
                    style={{ background: added ? '#4a7a50' : 'var(--amber)', borderColor: added ? '#4a7a50' : 'var(--amber)', color: 'var(--black)', opacity: !selId ? 0.4 : 1, cursor: !selId ? 'not-allowed' : 'pointer' }}>
                    {added ? '✓ Added to cart' : 'Add to cart'}
                  </button>

                  {ticket && (
                    <button disabled={!selId}
                      onClick={() => { handleAdd(); setTimeout(() => navigate('/cart'), 150) }}
                      className="btn w-full mt-2 cursor-pointer" style={{ cursor: !selId ? 'not-allowed' : 'pointer' }}>
                      Buy now →
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xl font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--muted)' }}>
              More {event.genre}
            </p>
            {related.map((e, i) => <EventRow key={e.id} event={e} index={i} />)}
            <div style={{ borderTop: '1px solid var(--border)' }} />
          </div>
        )}
      </div>
    </div>
  )
}
