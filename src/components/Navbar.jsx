import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { MdShield, MdPerson } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import FloatingWhatsApp from './FloatingWhatsApp'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currentUser, userName, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMobileOpen(false)
  }

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate(`/?scrollTo=${id}`)
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#FAFAF7] backdrop-blur-md border-b border-[#ECECEC] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-t-[3px] border-t-brand-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl lg:text-3xl font-bold font-display text-text-primary tracking-tight transition-colors duration-200 group-hover:text-brand-gold">
                Ovressa<span className="text-brand-gold">cars</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              <Link
                to="/cars"
                className="text-sm font-medium text-[#1F1F1F] hover:text-brand-gold transition-colors duration-200"
              >
                Rent a Car
              </Link>
              <button
                onClick={() => scrollToSection('brands')}
                className="text-sm font-medium text-[#1F1F1F] hover:text-brand-gold transition-colors duration-200 cursor-pointer"
              >
                Car Brands
              </button>
              <button
                onClick={() => scrollToSection('with-driver')}
                className="text-sm font-medium text-[#1F1F1F] hover:text-brand-gold transition-colors duration-200 cursor-pointer"
              >
                With Driver
              </button>
              <button
                onClick={() => scrollToSection('why-us')}
                className="text-sm font-medium text-[#1F1F1F] hover:text-brand-gold transition-colors duration-200 cursor-pointer"
              >
                About Us
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1.5 lg:gap-3 flex-wrap justify-end max-w-[50%] lg:max-w-none">
              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    className="shrink-0 px-4 py-2 text-sm font-semibold text-[#1F1F1F] hover:text-brand-gold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="shrink-0 px-4 py-2 text-sm font-semibold text-white bg-[#C9A84C] rounded-xl hover:bg-[#A8872D] transition-colors"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <span className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-[#C9A84C]">
                    <MdPerson size={16} />
                    {userName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="shrink-0 px-4 py-2 text-sm font-medium text-text-secondary border border-border-light rounded-xl hover:border-danger hover:text-danger transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              )}
              <Link
                to="/admin/login"
                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#1F1F1F] text-white text-sm font-semibold rounded-xl hover:bg-brand-gold-dark transition-colors"
              >
                <MdShield size={16} />
                <span className="hidden lg:inline">Admin</span>
              </Link>
              <button
                onClick={() => scrollToSection('contact')}
                className="shrink-0 px-5 py-2.5 bg-[#C9A84C] text-white text-sm font-bold rounded-xl hover:bg-[#A8872D] transition-colors cursor-pointer"
              >
                <span className="hidden lg:inline">Contact Us</span>
                <span className="lg:hidden">Contact</span>
              </button>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-bold rounded-xl shadow-[0_8px_24px_rgba(37,211,102,0.30)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(37,211,102,0.40)] transition-all duration-200"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-text-primary p-2 z-[61] relative cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <>
            <div className="md:hidden fixed inset-0 bg-black/20 z-[55]" onClick={() => setMobileOpen(false)} />
            <div className="md:hidden bg-white border-t border-border-light shadow-lg-custom fixed left-0 right-0 z-[60] max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-3">
              <Link
                to="/cars"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium py-3 px-3 rounded-xl text-[#1F1F1F] hover:bg-[#F8F7F4] transition-colors"
              >
                Rent a Car
              </Link>
              <button
                onClick={() => scrollToSection('brands')}
                className="block w-full text-left text-sm font-medium py-3 px-3 rounded-xl text-[#1F1F1F] hover:bg-[#F8F7F4] transition-colors cursor-pointer"
              >
                Car Brands
              </button>
              <button
                onClick={() => scrollToSection('with-driver')}
                className="block w-full text-left text-sm font-medium py-3 px-3 rounded-xl text-[#1F1F1F] hover:bg-[#F8F7F4] transition-colors cursor-pointer"
              >
                With Driver
              </button>
              <button
                onClick={() => scrollToSection('why-us')}
                className="block w-full text-left text-sm font-medium py-3 px-3 rounded-xl text-[#1F1F1F] hover:bg-[#F8F7F4] transition-colors cursor-pointer"
              >
                About Us
              </button>
              <hr className="border-border-light" />
              {!currentUser ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center px-4 py-3 text-sm font-bold text-[#1F1F1F] border-2 border-[#1F1F1F] rounded-xl hover:bg-[#1F1F1F] hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-center px-4 py-3 text-sm font-bold text-white bg-[#C9A84C] rounded-xl hover:bg-[#A8872D] transition-colors"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-[#C9A84C] bg-[#FBF5E6] rounded-xl">
                    <MdPerson size={18} />
                    {userName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-sm font-medium text-danger bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#1F1F1F] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <MdShield size={16} />
                Admin Panel
              </Link>
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full px-4 py-3 bg-[#C9A84C] text-white text-sm font-bold rounded-xl hover:bg-[#A8872D] transition-colors cursor-pointer"
              >
                Contact Us
              </button>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] text-white text-sm font-bold rounded-xl shadow-[0_8px_24px_rgba(37,211,102,0.30)] hover:opacity-90 transition-opacity"
                onClick={() => setMobileOpen(false)}
              >
                <FaWhatsapp size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </>
        )}
      </nav>
      <FloatingWhatsApp />
    </>
  )
}
