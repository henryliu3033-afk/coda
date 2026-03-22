import { Link, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useCart, total, count } from '../store/cart.store'

export default function Cart() {
  const { items, remove, setQty, clear } = useCart()
  const cartTotal = useCart(total)
  const cartCount = useCart(count)
  const navigate  = useNavigate()

  if (items.length === 0) return (
    <div className="page-in" style={{ paddingTop: '60px' }}>
      <div className="wrap py-24 text-center">
        <p className="font-light text-5xl md:text-7xl mb-4" style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>
          Your cart is empty.
        </p>
        <p className="text-2xl mb-8" style={{ color: 'var(--muted)' }}>Browse upcoming shows and grab your tickets.</p>
        <Link to="/events" className="btn btn-amber">Browse Events</Link>
      </div>
    </div>
  )

  return (
    <div className="page-in" style={{ paddingTop: '60px' }}>
      <div className="wrap pt-10 md:pt-16 pb-20">
        <div className="flex items-baseline justify-between mb-8 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h1 className="font-light text-5xl md:text-7xl" style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>
            Cart
          </h1>
          <span className="text-2xl" style={{ color: 'var(--muted)' }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Items */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.key}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                  className="flex gap-5 py-6" style={{ borderBottom: '1px solid var(--border)' }}>

                  <Link to={`/event/${item.event.id}`} className="flex-shrink-0">
                    <img src={item.event.img} alt={item.event.artist}
                      className="w-20 h-16 sm:w-28 sm:h-20 object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-medium mb-0.5" style={{ color: 'var(--text)' }}>
                          {item.event.artist}
                        </h3>
                        <p className="text-2xl" style={{ color: 'var(--muted)' }}>
                          {item.ticket.name} · {item.event.venue}
                        </p>
                        <p className="text-xl mt-0.5" style={{ color: 'var(--amber)' }}>
                          {item.event.date} · {item.event.doors}
                        </p>
                      </div>
                      <button onClick={() => remove(item.key)}
                        className="text-xl cursor-pointer transition-colors flex-shrink-0"
                        style={{ color: 'var(--faint)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--faint)'}>
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-0" style={{ border: '1px solid var(--border)' }}>
                        <button onClick={() => setQty(item.key, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
                          style={{ color: 'var(--muted)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>−</button>
                        <span className="w-8 text-center text-2xl" style={{ color: 'var(--text)' }}>{item.qty}</span>
                        <button onClick={() => setQty(item.key, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
                          style={{ color: 'var(--muted)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>+</button>
                      </div>
                      <span className="text-2xl font-medium" style={{ color: 'var(--text)' }}>
                        NT${(item.ticket.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button onClick={clear}
              className="text-xl cursor-pointer mt-4 transition-colors"
              style={{ color: 'var(--faint)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--muted)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--faint)'}>
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="p-6" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <p className="text-xl font-medium tracking-widest uppercase mb-5" style={{ color: 'var(--muted)' }}>
                Summary
              </p>

              {items.map(item => (
                <div key={item.key} className="flex justify-between mb-3">
                  <span className="text-2xl" style={{ color: 'var(--muted)' }}>
                    {item.event.artist} × {item.qty}
                  </span>
                  <span className="text-2xl" style={{ color: 'var(--text)' }}>
                    NT${(item.ticket.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="flex justify-between py-4 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-2xl font-medium" style={{ color: 'var(--text)' }}>Total</span>
                <span className="text-4xl font-medium" style={{ color: 'var(--text)' }}>
                  NT${cartTotal.toLocaleString()}
                </span>
              </div>

              <button className="btn btn-amber w-full mt-2 cursor-pointer" onClick={() => navigate('/checkout')}>
                Checkout
              </button>
              <Link to="/events" className="btn w-full mt-2 text-xl text-center block" style={{ textAlign: 'center' }}>
                ← Keep browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
