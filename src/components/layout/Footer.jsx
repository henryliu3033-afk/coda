import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)' }}>
      <div className="wrap py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">

          <div>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '40px', color: 'var(--text)', letterSpacing: '0.12em', display: 'block', marginBottom: '8px' }}>
              CODA
            </span>
            <p className="text-2xl" style={{ color: 'var(--muted)', maxWidth: '260px', lineHeight: 1.7 }}>
              精選現場演出票務平台。<br />每一場演出都值得被好好感受。
            </p>
          </div>

          <div className="flex gap-16">
            {[
              { head: 'Navigate', links: [['Events', '/events'], ['Cart', '/cart'], ['My Tickets', '/my-tickets']] },
              { head: 'Follow',   links: [['Instagram', '#'], ['Facebook', '#'], ['Spotify', '#']] },
            ].map(({ head, links }) => (
              <div key={head}>
                <p className="text-xl font-medium tracking-widest uppercase mb-5" style={{ color: 'var(--faint)' }}>
                  {head}
                </p>
                <div className="flex flex-col gap-3">
                  {links.map(([label, to]) => (
                    <Link key={label} to={to}
                      className="text-2xl transition-colors"
                      style={{ color: 'var(--muted)', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
          style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xl" style={{ color: 'var(--faint)' }}>
            © {new Date().getFullYear()} CODA. All rights reserved.
          </p>
          <p className="text-xl" style={{ color: 'var(--faint)' }}>
            Live music deserves a good seat.
          </p>
        </div>
      </div>
    </footer>
  )
}
