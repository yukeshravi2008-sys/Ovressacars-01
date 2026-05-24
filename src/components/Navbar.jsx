import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { MdShield } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import FloatingWhatsApp from './FloatingWhatsApp'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMobileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Cars', path: '/cars' },
    { label: 'About', path: '/' },
    { label: 'Contact', path: '/' },
  ]

  return (
    <>
    <nav className="sticky top-0 z-50 bg-[#FAFAF7] backdrop-blur-md border-b border-[#ECECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl lg:text-3xl font-bold font-display text-text-primary tracking-tight">
              Ovressa<span className="text-brand">cars</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors py-1 ${
                    active
                      ? 'text-brand'
                      : 'text-[#1F1F1F] hover:text-[#C8A96B]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-5">
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-[#1F1F1F] border border-[#1F1F1F] rounded-xl hover:bg-[#1F1F1F] hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-medium text-[#1F1F1F] hover:text-[#C8A96B] transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-text-muted">My Account</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-text-secondary border border-border-light rounded-xl hover:border-danger hover:text-danger transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            <Link
              to="/admin/login"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1F1F1F] text-white text-sm font-semibold rounded-xl hover:bg-brand transition-colors duration-250"
            >
              <MdShield size={16} />
              Admin
            </Link>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp size={16} />
              WhatsApp
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-text-primary p-2"
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border-light animate-fade-in shadow-md-custom">
          <div className="px-4 py-6 space-y-3">
            {navLinks.map((link) => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-sm font-medium py-2.5 px-3 rounded-xl transition-colors ${
                    active ? 'text-brand bg-accent-light' : 'text-[#1F1F1F]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#1F1F1F] text-white text-sm font-semibold rounded-xl hover:bg-brand transition-colors"
            >
              <MdShield size={16} />
              Admin
            </Link>
            <hr className="border-border-light" />
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <FaWhatsapp size={16} />
              WhatsApp Us
            </a>
            {!currentUser ? (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 text-sm font-semibold text-[#1F1F1F] border border-[#1F1F1F] rounded-xl hover:bg-[#1F1F1F] hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 text-sm font-medium text-[#1F1F1F] hover:text-[#C8A96B] transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm font-medium text-danger bg-red-50 rounded-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </nav>
      <FloatingWhatsApp />
    </>
  )
}
