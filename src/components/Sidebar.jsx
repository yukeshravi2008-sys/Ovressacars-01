import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdDashboard, MdDirectionsCar, MdAddCircle, MdBookOnline, MdPeople, MdSettings, MdLogout } from 'react-icons/md'
import { HiMenu, HiX } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: MdDashboard },
  { label: 'Cars', path: '/admin/cars', icon: MdDirectionsCar },
  { label: 'Add New Car', path: '/admin/cars/add', icon: MdAddCircle },
  { label: 'Bookings', path: '/admin/bookings', icon: MdBookOnline },
  { label: 'Users', path: '/admin/users', icon: MdPeople },
  { label: 'Settings', path: '/admin/settings', icon: MdSettings },
]

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white border border-border-light rounded-xl text-text-primary shadow-sm-custom"
      >
        {mobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
      </button>

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 w-64 min-h-screen bg-white border-r border-border-light flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-border-light">
          <Link to="/" className="text-xl font-bold font-display">
            <span className="text-text-primary">Ovressa</span>
            <span className="text-brand">cars</span>
          </Link>
          <p className="text-xs text-text-muted mt-1.5 font-medium">Admin Portal</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.path)
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  active
                    ? 'text-brand bg-accent-light'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-section'
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-border-light">
          <p className="text-xs text-text-muted truncate mb-3 font-medium">
            {currentUser?.email || ''}
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-danger transition-colors w-full font-medium"
          >
            <MdLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/10 backdrop-blur-sm"
        />
      )}
    </>
  )
}
