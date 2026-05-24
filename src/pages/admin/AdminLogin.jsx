import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdArrowBack, MdShield } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { getUserDocument } from '../../firebase/userService'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login, logout, currentUser, userRole } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser && userRole === 'admin') {
      navigate('/admin/dashboard', { replace: true })
    } else if (currentUser && userRole !== 'admin') {
      toast.error('This portal is for admins only.')
      navigate('/', { replace: true })
    }
  }, [currentUser, userRole, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const cred = await login(email, password)
      const userDoc = await getUserDocument(cred.user.uid)
      if (userDoc?.role !== 'admin') {
        await logout()
        toast.error('Access denied. This portal is for admins only.')
        navigate('/')
        return
      }
      toast.success('Welcome back, Admin!')
      navigate('/admin/dashboard')
    } catch (error) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (currentUser) return null

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
      <div className="w-full max-w-md bg-white border border-border-light rounded-[24px] overflow-hidden shadow-lg-custom">
        <div className="h-1 bg-gradient-to-r from-brand to-accent-dark" />
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-light border border-brand/20 flex items-center justify-center">
              <MdShield size={32} className="text-brand" />
            </div>
            <h2 className="text-xl font-bold text-text-primary font-display">Admin Portal</h2>
            <p className="text-sm text-text-muted font-medium">Ovressacars Administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <MdEmail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-bg-primary border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
            </div>

            <div className="relative">
              <MdLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-bg-primary border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-[15px] cursor-pointer"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing In...' : 'Admin Sign In'}
            </button>
          </form>

          <Link
            to="/"
            className="flex items-center justify-center gap-1 text-sm text-text-muted hover:text-brand mt-6 transition-colors font-medium"
          >
            <MdArrowBack size={16} />
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  )
}
