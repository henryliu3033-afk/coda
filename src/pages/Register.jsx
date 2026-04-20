import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { useAuth } from '../store/auth.store'

export default function Register() {
  const { register } = useAuth()
  const navigate      = useNavigate()

  const [form,    setForm]    = useState({ name: '', email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const f = k => ({ value: form[k], onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) })

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-in" style={{ paddingTop: '60px' }}>
      <div className="wrap pt-16 pb-24 max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-light text-6xl md:text-7xl mb-2"
            style={{ fontFamily: 'var(--serif)', color: 'var(--text)' }}>
            Create account.
          </h1>
          <p className="text-2xl mb-10" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--amber)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>

          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <label className="text-xl font-medium tracking-widest uppercase block mb-2"
                style={{ color: 'var(--faint)' }}>Name</label>
              <input className="field" placeholder="Your name"
                required {...f('name')} />
            </div>
            <div>
              <label className="text-xl font-medium tracking-widest uppercase block mb-2"
                style={{ color: 'var(--faint)' }}>Email</label>
              <input type="email" className="field" placeholder="your@email.com"
                required {...f('email')} />
            </div>
            <div>
              <label className="text-xl font-medium tracking-widest uppercase block mb-2"
                style={{ color: 'var(--faint)' }}>Password</label>
              <input type="password" className="field" placeholder="••••••••"
                required minLength={6} {...f('password')} />
            </div>

            {error && (
              <p className="text-xl px-4 py-3"
                style={{ color: 'var(--amber)', border: '1px solid var(--amber)', background: 'rgba(245,158,11,0.06)' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-amber mt-2 cursor-pointer" disabled={loading}>
              {loading ? 'Creating…' : 'Create account →'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
