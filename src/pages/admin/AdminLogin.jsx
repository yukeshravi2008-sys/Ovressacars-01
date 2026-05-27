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
      if (!userDoc || userDoc?.role !== 'admin') {
        await logout()
        toast.error('Access denied. This portal is for admins only.')
        navigate('/')
        return
      }
      toast.success('Welcome back, Admin!')
      navigate('/admin/dashboard')
    } catch (error) {
      const code = error.code
      const msg =
        code === 'auth/user-not-found'
          ? 'No admin account found with this email'
          : code === 'auth/wrong-password' || code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : code === 'auth/invalid-email'
          ? 'Please enter a valid email address'
          : code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : error.message || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (currentUser) return null

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FAFAF8] px-5 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="w-full max-w-[460px] relative z-10">
        <div className="text-center mb-10 animate-slide-up-sm">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#FBF5E6] flex items-center justify-center shadow-lg shadow-[#C9A84C]/20">
            <MdShield size={36} className="text-[#C9A84C]" />
          </div>
          <h2 className="text-xl font-bold font-display text-[#1A1A1A]">Admin Portal</h2>
          <p className="text-sm text-[#9A9A9A] font-medium">Ovressacars Administration</p>
        </div>

        <div
          className="bg-white border border-[#E8E8E0] rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 animate-slide-up-sm"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1A1A1A]">Admin Email</label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ABABAB] pointer-events-none z-10 w-5 h-5" />
                <input
                  type="email"
                  placeholder="admin@ovressacars.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-14 pr-12 bg-[#FAFAF8] border border-[#E8E8E0] rounded-2xl text-sm text-[#1A1A1A] placeholder:text-[#ABABAB] placeholder:font-medium outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1A1A1A]">Password</label>
              <div className="relative">
                <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ABABAB] pointer-events-none z-10 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-14 pr-14 bg-[#FAFAF8] border border-[#E8E8E0] rounded-2xl text-sm text-[#1A1A1A] placeholder:text-[#ABABAB] placeholder:font-medium outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ABABAB] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-black text-white font-semibold rounded-2xl hover:bg-[#1a1a1a] hover:scale-[1.02] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer text-[15px] flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing In...' : 'Admin Sign In'}
            </button>
          </form>

          <Link
            to="/"
            className="flex items-center justify-center gap-1 text-sm text-[#6B6B6B] hover:text-[#C9A84C] mt-6 transition-colors font-medium"
          >
            <MdArrowBack size={16} />
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  )
}