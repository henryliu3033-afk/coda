import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { useCart, total } from '../store/cart.store'
import { useOrders } from '../store/orders.store'

export default function Checkout() {
  const { items, clear }  = useCart()
  const cartTotal         = useCart(total)
  const { place }         = useOrders()
  const navigate          = useNavigate()

  const [step,    setStep]    = useState(1)
  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', card: '', expiry: '', cvv: '' })
  const [errors,  setErrors]  = useState({})

  const f = k => ({ value: form[k], onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) })

  if (items.length === 0 && !order) return (
    <div className="page-in" style={{ paddingTop: '60px' }}>
      <div className="wrap py-24 text-center">
        <p className="text-2xl mb-6" style={{ color: 'var(--muted)' }}>Nothing to checkout.</p>
        <Link to="/events" className="btn btn-amber">Browse Events</Link>
      </div>
    </div>
  )

  const validate = () => {
    const e = {}
    if (!form.name)  e.name  = 'Required'
    if (!form.email) e.email = 'Required'
    if (!form.phone) e.phone = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const confirm = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const o = place(items, cartTotal, form)
    clear()
    setOrder(o)
    setStep(3)
    setLoading(false)
    window.scrollTo(0, 0)
  }

  /* ── Confirmed ── */
  if (step === 3 && order) return (
    <div className="page-in" style={{ paddingTop: '60px' }}>
      <div className="wrap py-16 md:py-24 max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xl font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--amber)' }}>
            Confirmed
          </p>
          <h1 className="font-light text-6xl md:text-7xl mb-2" style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>
            You're going.
          </h1>
          <p className="text-2xl mb-8" style={{ color: 'var(--muted)' }}>
            Order {order.id} · Confirmation sent to {form.email}
          </p>

          {/* Tickets */}
          <div style={{ border: '1px solid var(--border)' }}>
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              <p className="text-xl font-medium tracking-widest uppercase" style={{ color: 'var(--muted)' }}>Your Tickets</p>
            </div>
            {order.items.map(item => (
              <div key={item.key} className="flex items-center gap-5 p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex-shrink-0 p-2" style={{ background: 'white' }}>
                  <QRCodeSVG value={`CODA-${order.id}-${item.key}`} size={72} fgColor="#0A0A0A" bgColor="white" level="H" />
                </div>
                <div>
                  <p className="text-3xl font-medium mb-0.5" style={{ color: 'var(--text)' }}>{item.event.artist}</p>
                  <p className="text-2xl" style={{ color: 'var(--muted)' }}>{item.ticket.name} × {item.qty}</p>
                  <p className="text-xl mt-0.5" style={{ color: 'var(--amber)' }}>{item.event.date} · {item.event.venue}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <Link to="/my-tickets" className="btn btn-amber">My Tickets</Link>
            <Link to="/events" className="btn">More Events</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )

  return (
    <div className="page-in" style={{ paddingTop: '60px' }}>
      <div className="wrap pt-10 md:pt-16 pb-20">
        <h1 className="font-light text-5xl md:text-7xl mb-8" style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>
          {step === 1 ? 'Contact details' : 'Payment'}
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {['Contact', 'Payment'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center text-xl font-medium"
                  style={{
                    background: step > i + 1 ? 'var(--amber)' : step === i + 1 ? 'var(--surface)' : 'transparent',
                    border: `1px solid ${step >= i + 1 ? 'var(--amber)' : 'var(--border)'}`,
                    color: step >= i + 1 ? 'var(--amber)' : 'var(--faint)',
                  }}>
                  {step > i + 1 ? '✓' : i + 1}
                </span>
                <span className="text-2xl" style={{ color: step === i + 1 ? 'var(--text)' : 'var(--faint)' }}>{s}</span>
              </div>
              {i < 1 && <span style={{ color: 'var(--border2)' }}>—</span>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xl font-medium tracking-widest uppercase block mb-2" style={{ color: 'var(--faint)' }}>Name</label>
                      <input className="field" placeholder="Your name" {...f('name')} />
                      {errors.name && <p className="text-xl mt-1" style={{ color: 'var(--amber)' }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xl font-medium tracking-widest uppercase block mb-2" style={{ color: 'var(--faint)' }}>Phone</label>
                      <input type="tel" className="field" placeholder="09xx-xxx-xxx" {...f('phone')} />
                      {errors.phone && <p className="text-xl mt-1" style={{ color: 'var(--amber)' }}>{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-xl font-medium tracking-widest uppercase block mb-2" style={{ color: 'var(--faint)' }}>Email</label>
                    <input type="email" className="field" placeholder="your@email.com" {...f('email')} />
                    {errors.email && <p className="text-xl mt-1" style={{ color: 'var(--amber)' }}>{errors.email}</p>}
                  </div>
                  <button className="btn btn-amber mt-2 cursor-pointer" onClick={() => { if (validate()) setStep(2) }}>
                    Continue to payment →
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col gap-5">
                  <div className="p-4 text-xl" style={{ border: '1px solid var(--border)', color: 'var(--faint)' }}>
                    🔒 Demo mode — any card number works
                  </div>
                  <div>
                    <label className="text-xl font-medium tracking-widest uppercase block mb-2" style={{ color: 'var(--faint)' }}>Card number</label>
                    <input className="field" placeholder="1234 5678 9012 3456" {...f('card')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xl font-medium tracking-widest uppercase block mb-2" style={{ color: 'var(--faint)' }}>Expiry</label>
                      <input className="field" placeholder="MM / YY" {...f('expiry')} />
                    </div>
                    <div>
                      <label className="text-xl font-medium tracking-widest uppercase block mb-2" style={{ color: 'var(--faint)' }}>CVV</label>
                      <input className="field" placeholder="123" {...f('cvv')} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button className="btn cursor-pointer" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn btn-amber flex-1 cursor-pointer" onClick={confirm} disabled={loading}>
                      {loading ? 'Processing…' : `Confirm NT$${cartTotal.toLocaleString()}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="p-5" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <p className="text-xl font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>Order</p>
              {items.map(item => (
                <div key={item.key} className="flex gap-3 items-center mb-4">
                  <img src={item.event.img} alt="" className="w-12 h-9 object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-medium truncate" style={{ color: 'var(--text)' }}>{item.event.artist}</p>
                    <p className="text-xl" style={{ color: 'var(--muted)' }}>{item.ticket.name} × {item.qty}</p>
                  </div>
                  <span className="text-2xl flex-shrink-0" style={{ color: 'var(--text)' }}>
                    NT${(item.ticket.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-2xl font-medium" style={{ color: 'var(--text)' }}>Total</span>
                <span className="text-3xl font-medium" style={{ color: 'var(--text)' }}>
                  NT${cartTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
