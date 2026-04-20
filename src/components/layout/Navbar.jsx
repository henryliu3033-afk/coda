import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useCart, count } from '../../store/cart.store'
import { useAuth, isLoggedIn } from '../../store/auth.store'

const LINKS = [
  { to: '/events',     label: 'Events'  },
  { to: '/my-tickets', label: 'Tickets' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const cartCount = useCart(count)
  const loggedIn  = useAuth(isLoggedIn)
  const user      = useAuth(s => s.user)
  const logout    = useAuth(s => s.logout)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200"
        style={{
          background: scrolled || open ? 'rgba(10,10,10,0.97)' : 'transparent',
          borderBottom: scrolled || open ? '1px solid var(--border)' : '1px solid transparent',
          backdropFilter: scrolled || open ? 'blur(12px)' : 'none',
        }}>
        <div className="wrap flex items-center" style={{ height: '60px' }}>

          {/* Logo — left 1/3 */}
          <div className="flex-1">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '44px', color: 'var(--text)', letterSpacing: '0.12em' }}>
                CODA
              </span>
            </Link>
          </div>

          {/* Desktop nav — center 1/3 */}
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
            {LINKS.map(({ to, label }) => {
              const active = location.pathname.startsWith(to)
              return (
                <Link key={to} to={to}
                  className="text-2xl font-medium tracking-wider uppercase transition-colors"
                  style={{
                    textDecoration: 'none',
                    color: active ? 'var(--text)' : 'var(--muted)',
                    borderBottom: active ? '1px solid var(--amber)' : '1px solid transparent',
                    paddingBottom: '2px',
                  }}>
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right — right 1/3 */}
          <div className="flex flex-1 items-center justify-end gap-3 flex-nowrap">
            <div className="hidden md:block">
              <Link to="/cart" className="btn text-sm px-3 py-1.5 cursor-pointer whitespace-nowrap"
                style={{
                  background: cartCount > 0 ? 'var(--amber)' : 'transparent',
                  borderColor: cartCount > 0 ? 'var(--amber)' : 'var(--border2)',
                  color: cartCount > 0 ? 'var(--black)' : 'var(--muted)',
                }}>
                {cartCount > 0 ? `Cart (${cartCount})` : 'Cart'}
              </Link>
            </div>

            {/* Auth button - desktop */}
            {loggedIn ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-2xl" style={{ color: 'var(--muted)' }}>
                  {user?.name}
                </span>
                <button className="text-2xl cursor-pointer whitespace-nowrap"
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', fontFamily: 'var(--sans)', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login"
                className="hidden md:inline-flex btn text-sm px-3 py-1.5 cursor-pointer"
                style={{ borderColor: 'var(--border2)', color: 'var(--muted)' }}>
                Sign in
              </Link>
            )}

            {/* Hamburger */}
            <button className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 cursor-pointer"
              onClick={() => setOpen(v => !v)}>
              {[0, 1, 2].map(i => (
                <span key={i} className="block transition-all duration-200 origin-center"
                  style={{
                    width: '20px', height: '1px',
                    background: 'var(--muted)',
                    opacity: i === 1 && open ? 0 : 1,
                    transform: i === 0 && open ? 'rotate(45deg) translate(3.5px,3.5px)' : i === 2 && open ? 'rotate(-45deg) translate(3.5px,-3.5px)' : 'none',
                  }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="fixed top-[60px] left-0 right-0 z-40 md:hidden overflow-hidden"
            style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
            <div className="wrap py-6 flex flex-col gap-0">
              {[...LINKS, { to: '/cart', label: cartCount > 0 ? `Cart (${cartCount})` : 'Cart' }].map(({ to, label }) => (
                <Link key={to} to={to}
                  className="py-4 text-3xl font-medium tracking-wide uppercase transition-colors"
                  style={{ color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                  {label}
                </Link>
              ))}
              {loggedIn ? (
                <button
                  className="py-4 text-3xl font-medium tracking-wide uppercase text-left cursor-pointer"
                  style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)', background: 'none', border: 'none', borderBottom: '1px solid var(--border)' }}
                  onClick={handleLogout}>
                  Sign out
                </button>
              ) : (
                <Link to="/login"
                  className="py-4 text-3xl font-medium tracking-wide uppercase"
                  style={{ color: 'var(--muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
