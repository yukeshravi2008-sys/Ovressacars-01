import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MdDirectionsCar, MdPeople, MdBookOnline, MdCurrencyRupee,
  MdEdit, MdToggleOn, MdToggleOff, MdWhatsapp, MdCheckCircle,
  MdCancel, MdDateRange
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { subscribeBookings, updateBookingStatus } from '../../firebase/bookingService'
import { subscribeCars } from '../../firebase/carService'
import { getAllUsers } from '../../firebase/userService'
import Sidebar from '../../components/Sidebar'
import ConfirmModal from '../../components/ConfirmModal'
import toast from 'react-hot-toast'

const statusStyles = {
  pending: 'bg-[#FEF3C7] text-[#D97706]',
  confirmed: 'bg-[#DCFCE7] text-[#166534]',
  completed: 'bg-[#EFF6FF] text-[#1D4ED8]',
  cancelled: 'bg-[#FEE2E2] text-[#991B1B]',
}

export default function Dashboard() {
  const [cars, setCars] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('cars')
  const [actionModal, setActionModal] = useState({ isOpen: false, booking: null, action: '' })
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

  useEffect(() => {
    const unsubCars = subscribeCars((data) => {
      setCars(data)
    })
    const unsubBookings = subscribeBookings((data) => {
      setBookings(data)
      setLoading(false)
    })
    getAllUsers()
      .then(setUsers)
      .catch(() => {})
    return () => {
      unsubCars()
      unsubBookings()
    }
  }, [])

  const totalCars = cars.length
  const availableCars = cars.filter((c) => c.available).length
  const totalBookings = bookings.length
  const revenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0)
  const pendingBookings = bookings.filter((b) => b.status === 'pending')

  const recentCars = cars.slice(0, 5)
  const recentBookings = bookings.slice(0, 8)

  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(Number(p) || 0)
  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const handleBookingAction = async () => {
    if (!actionModal.booking || !actionModal.action) return
    try {
      await updateBookingStatus(actionModal.booking.id, actionModal.action)
      toast.success(`Booking ${actionModal.action} successfully`)
    } catch {
      toast.error('Failed to update booking')
    }
    setActionModal({ isOpen: false, booking: null, action: '' })
  }

  const openWhatsApp = (booking) => {
    const msg = encodeURIComponent(
      `Hello! This is regarding your booking for ${booking.carName}.`
    )
    const phone = booking.customerPhone || whatsapp
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
  }

  const formatPriceShort = (p) => {
    const n = Number(p) || 0
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
    return `₹${formatPrice(p)}`
  }

  const stats = [
    { icon: MdDirectionsCar, label: 'Total Cars', value: totalCars },
    { icon: MdDirectionsCar, label: 'Available Cars', value: availableCars },
    { icon: MdBookOnline, label: 'Total Bookings', value: totalBookings },
    { icon: MdCurrencyRupee, label: 'Revenue', value: `₹${formatPrice(revenue)}` },
  ]

  return (
    <div className="flex min-h-screen bg-bg-section">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8">
        <div className="mb-6 pl-14 lg:pl-0">
          <h1 className="text-2xl font-bold text-text-primary font-display">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1 font-medium">Welcome back, {currentUser?.email || 'Admin'}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-white border border-border-light rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF5E6] flex items-center justify-center">
                    <Icon size={22} className="text-[#C9A84C]" />
                  </div>
                  <span className="text-3xl font-bold text-text-primary">{stat.value}</span>
                </div>
                <p className="text-sm text-text-muted font-medium">{stat.label}</p>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-1 mb-6 pl-14 lg:pl-0 border-b border-border-light">
          <button
            onClick={() => setActiveTab('cars')}
            className={`px-5 py-3 text-sm font-bold transition-colors relative cursor-pointer ${
              activeTab === 'cars'
                ? 'text-[#C9A84C]'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Recent Cars
            {activeTab === 'cars' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-3 text-sm font-bold transition-colors relative cursor-pointer ${
              activeTab === 'bookings'
                ? 'text-[#C9A84C]'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Booking Requests
            {pendingBookings.length > 0 && (
              <span className="absolute top-2.5 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
            )}
            {activeTab === 'bookings' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />
            )}
          </button>
        </div>

        {activeTab === 'cars' && (
          <>
            <div className="flex flex-wrap gap-3 mb-8 pl-14 lg:pl-0">
              <button
                onClick={() => navigate('/admin/cars/add')}
                className="px-5 py-2.5 bg-[#C9A84C] text-white font-bold rounded-xl hover:bg-[#A8872D] transition-all duration-200 text-sm cursor-pointer"
              >
                Add New Car
              </button>
              <button
                onClick={() => navigate('/admin/cars')}
                className="px-5 py-2.5 bg-transparent text-[#C9A84C] font-semibold border-[1.5px] border-[#C9A84C] rounded-xl hover:bg-[#FBF5E6] transition-all duration-200 text-sm cursor-pointer"
              >
                Manage Cars
              </button>
            </div>

            <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-card">
              <div className="p-5 border-b border-border-light">
                <h2 className="text-lg font-bold text-text-primary font-display">Recent Cars Added</h2>
              </div>

              {!loading && cars.length === 0 ? (
                <div className="p-10 text-center text-text-muted font-medium">No cars added yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[#ABABAB] text-[12px] uppercase tracking-[1px] border-b border-border-light bg-[#F8F7F4]">
                        <th className="text-left p-4 font-semibold">Photo</th>
                        <th className="text-left p-4 font-semibold">Name</th>
                        <th className="text-left p-4 font-semibold">Type</th>
                        <th className="text-left p-4 font-semibold">Price/Day</th>
                        <th className="text-left p-4 font-semibold">Availability</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCars.map((car) => (
                        <tr key={car.id} className="border-b border-border-light last:border-0 hover:bg-[#FAFAF8] transition-colors duration-200">
                          <td className="p-4">
                            <div className="w-12 h-9 rounded-lg overflow-hidden bg-bg-section">
                              {car.photoURL ? (
                                <img src={car.photoURL} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <MdDirectionsCar size={16} className="text-text-muted" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-text-primary font-semibold">{car.name}</td>
                          <td className="p-4 text-text-secondary">{car.type || 'N/A'}</td>
                          <td className="p-4 text-[#C9A84C] font-bold">₹{formatPrice(car.pricePerDay)}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-[100px] ${
                                car.available
                                  ? 'bg-[#DCFCE7] text-[#166534]'
                                  : 'bg-[#FEE2E2] text-[#991B1B]'
                              }`}
                            >
                              {car.available ? 'Available' : 'Booked'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                              className="p-2 bg-[#FBF5E6] text-[#C9A84C] rounded-xl hover:bg-[#FBF5E6]/80 transition-colors duration-200 cursor-pointer"
                              title="Edit"
                            >
                              <MdEdit size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {cars.length > 5 && (
                <div className="p-4 border-t border-border-light text-center">
                  <Link to="/admin/cars" className="text-sm text-[#C9A84C] hover:underline font-semibold">
                    View All Cars
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-card">
            <div className="p-5 border-b border-border-light flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary font-display">Booking Requests</h2>
              <Link to="/admin/bookings" className="text-sm text-[#C9A84C] hover:underline font-semibold">
                View All
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="p-10 text-center text-text-muted font-medium">
                {loading ? 'Loading...' : 'No booking requests yet.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text-muted text-xs uppercase border-b border-border-light bg-[#F8F7F4]">
                      <th className="text-left p-4 font-semibold">Customer</th>
                      <th className="text-left p-4 font-semibold">Car</th>
                      <th className="text-left p-4 font-semibold">Dates</th>
                      <th className="text-left p-4 font-semibold">Price</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-right p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border-light last:border-0 hover:bg-bg-section/50 transition-colors">
                        <td className="p-4">
                          <p className="text-text-primary font-semibold text-sm">{booking.customerName || 'N/A'}</p>
                          <p className="text-[11px] text-text-muted">{booking.customerPhone || ''}</p>
                        </td>
                        <td className="p-4 text-text-primary text-sm font-medium">{booking.carName || 'N/A'}</td>
                        <td className="p-4 text-text-secondary text-xs">
                          <span>{formatDate(booking.pickupDate)} — {formatDate(booking.returnDate)}</span>
                        </td>
                        <td className="p-4 text-brand font-bold text-sm">
                          ₹{formatPrice(booking.totalPrice)}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-full ${statusStyles[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => setActionModal({ isOpen: true, booking, action: 'confirmed' })}
                                  className="p-1.5 text-[#166534] hover:bg-[#DCFCE7] rounded-lg transition-colors cursor-pointer"
                                  title="Confirm"
                                >
                                  <MdCheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => setActionModal({ isOpen: true, booking, action: 'cancelled' })}
                                  className="p-1.5 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
                                  title="Cancel"
                                >
                                  <MdCancel size={16} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => openWhatsApp(booking)}
                              className="p-1.5 text-[#25D366] hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                              title="WhatsApp"
                            >
                              <FaWhatsapp size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, booking: null, action: '' })}
        onConfirm={handleBookingAction}
        title={actionModal.action?.charAt(0).toUpperCase() + actionModal.action?.slice(1) || ''}
        message={`Are you sure you want to ${actionModal.action} this booking?`}
        confirmText={actionModal.action?.charAt(0).toUpperCase() + actionModal.action?.slice(1) || ''}
        confirmVariant={actionModal.action === 'cancelled' ? 'danger' : 'warning'}
      />
    </div>
  )
}
