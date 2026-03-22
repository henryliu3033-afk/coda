import { useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { useOrders } from '../store/orders.store'

export default function MyTickets() {
  const { orders } = useOrders()
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="page-in" style={{ paddingTop: '60px' }}>
      <div className="wrap pt-10 md:pt-16 pb-20">
        <div className="flex items-baseline justify-between mb-8 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h1 className="font-light text-5xl md:text-7xl" style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>
            My Tickets
          </h1>
          <span className="text-2xl" style={{ color: 'var(--muted)' }}>{orders.length} orders</span>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-2xl mb-6" style={{ color: 'var(--muted)' }}>No tickets yet.</p>
            <Link to="/events" className="btn btn-amber">Browse Events</Link>
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                {/* Order header row */}
                <button
                  className="w-full flex items-center justify-between py-5 cursor-pointer"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="text-left">
                    <p className="text-2xl font-medium" style={{ color: 'var(--text)' }}>{order.id}</p>
                    <p className="text-xl mt-0.5" style={{ color: 'var(--muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString('zh-TW')} ·{' '}
                      {order.items.length} ticket type{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-medium" style={{ color: 'var(--text)' }}>
                      NT${order.total.toLocaleString()}
                    </span>
                    <span className="text-2xl transition-transform" style={{
                      color: 'var(--muted)',
                      transform: expanded === order.id ? 'rotate(180deg)' : 'none',
                      display: 'inline-block',
                    }}>↓</span>
                  </div>
                </button>

                {/* Expanded tickets */}
                <AnimatePresence>
                  {expanded === order.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pb-5 flex flex-col gap-4">
                        {order.items.map(item => (
                          <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5"
                            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                            <div className="flex-shrink-0 p-1.5" style={{ background: 'white' }}>
                              <QRCodeSVG value={`CODA-${order.id}-${item.key}`} size={80} fgColor="#0A0A0A" bgColor="white" level="H" />
                            </div>
                            <div>
                              <p className="text-3xl font-medium mb-0.5" style={{ color: 'var(--text)' }}>{item.event.artist}</p>
                              <p className="text-2xl" style={{ color: 'var(--muted)' }}>
                                {item.ticket.name} × {item.qty}
                              </p>
                              <p className="text-xl mt-1" style={{ color: 'var(--amber)' }}>
                                {item.event.date} · Doors {item.event.doors} · {item.event.venue}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
