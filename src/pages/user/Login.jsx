import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MdEmail, MdLock } from 'react-icons/md'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/cars'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await login(email.trim(), password)
      const name = email.trim().split('@')[0]
      const displayName = name.charAt(0).toUpperCase() + name.slice(1)
      toast.success(`Welcome back, ${displayName}!`)
      navigate(from, { replace: true })
    } catch (err) {
      const code = err.code
      const msg =
        code === 'auth/user-not-found'
          ? 'No account found with this email'
          : code === 'auth/wrong-password' || code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : code === 'auth/invalid-email'
          ? 'Please enter a valid email address'
          : code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : err.message || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

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
          <Link to="/" className="text-5xl font-bold font-display tracking-tight">
            <span className="text-[#1A1A1A]">Ovressa</span><span className="text-[#C9A84C]">cars</span>
          </Link>
          <div className="w-[50px] h-[4px] bg-[#C9A84C] rounded-full mx-auto mt-3" />
          <p className="text-[#6B6B6B] text-sm mt-4 font-medium">Premium Self Drive Car Rentals</p>
        </div>

        <div
          className="bg-white border border-[#E8E8E0] rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 animate-slide-up-sm"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#1A1A1A]">Email</label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ABABAB] pointer-events-none z-10 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-14 pl-14 pr-14 bg-[#FAFAF8] border border-[#E8E8E0] rounded-2xl text-sm text-[#1A1A1A] placeholder:text-[#ABABAB] placeholder:font-medium outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ABABAB] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#C9A84C] text-white font-semibold rounded-2xl hover:bg-[#A8872E] hover:scale-[1.02] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer text-[15px]"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E8E8E0] text-center">
            <p className="text-sm text-[#6B6B6B]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#C9A84C] font-semibold hover:text-[#A8872E] transition-colors">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}