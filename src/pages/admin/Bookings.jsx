import { useState, useEffect } from 'react'
import { MdCheckCircle, MdCancel, MdAutorenew, MdSearch, MdDirectionsCar, MdDateRange, MdCurrencyRupee } from 'react-icons/md'
import { getAllBookings, updateBookingStatus } from '../../firebase/bookingService'
import Sidebar from '../../components/Sidebar'
import ConfirmModal from '../../components/ConfirmModal'
import toast from 'react-hot-toast'

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-danger',
  completed: 'bg-green-100 text-success',
}

const statusIcons = {
  pending: MdAutorenew,
  approved: MdCheckCircle,
  rejected: MdCancel,
  completed: MdCheckCircle,
}

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actionModal, setActionModal] = useState({ isOpen: false, booking: null, action: '' })

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const data = await getAllBookings()
      setBookings(data)
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleAction = async () => {
    if (!actionModal.booking || !actionModal.action) return
    try {
      await updateBookingStatus(actionModal.booking.id, actionModal.action)
      setBookings((prev) =>
        prev.map((b) =>
          b.id === actionModal.booking.id ? { ...b, status: actionModal.action } : b
        )
      )
      toast.success(`Booking ${actionModal.action} successfully`)
    } catch {
      toast.error('Failed to update booking')
    }
    setActionModal({ isOpen: false, booking: null, action: '' })
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(Number(p) || 0)

  const getActionLabel = (action) => {
    switch (action) {
      case 'approved': return 'Approve'
      case 'rejected': return 'Reject'
      case 'completed': return 'Mark Completed'
      default: return action
    }
  }

  const filtered = bookings.filter((b) => {
    if (search) {
      const q = search.toLowerCase()
      if (!b.carName?.toLowerCase().includes(q) && !b.userName?.toLowerCase().includes(q) && !b.userEmail?.toLowerCase().includes(q)) return false
    }
    if (statusFilter && b.status !== statusFilter) return false
    return true
  })

  return (
    <div className="flex min-h-screen bg-bg-section">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary font-display">Bookings</h1>
          <p className="text-sm text-text-muted mt-1 font-medium">{bookings.length} total bookings</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-xs shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FAFAF7] border border-[#ECECEC] w-9 h-9 rounded-full z-10 flex items-center justify-center">
              <MdSearch size={20} className="text-[#1F1F1F]" />
            </div>
            <input
              type="text"
              placeholder="Search by car, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-4 py-2.5 bg-white border border-border-light rounded-xl text-sm text-[#1F1F1F] placeholder:text-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-border-light rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white border border-border-light rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <MdDirectionsCar size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted font-medium">No bookings found.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-muted text-xs uppercase border-b border-border-light bg-white">
                    <th className="text-left p-4 font-semibold">Customer</th>
                    <th className="text-left p-4 font-semibold">Car</th>
                    <th className="text-left p-4 font-semibold">Dates</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking) => {
                    const StatusIcon = statusIcons[booking.status] || MdAutorenew
                    return (
                      <tr key={booking.id} className="border-b border-border-light last:border-0 hover:bg-bg-section/50 transition-colors bg-white">
                        <td className="p-4">
                          <div>
                            <p className="text-text-primary font-semibold">{booking.userName || 'Unknown'}</p>
                            <p className="text-xs text-text-muted">{booking.userEmail}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-text-primary font-medium">{booking.carName || 'N/A'}</span>
                        </td>
                        <td className="p-4 text-text-secondary">
                          <div className="flex items-center gap-1">
                            <MdDateRange size={14} />
                            <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-brand font-bold">
                          <div className="flex items-center gap-1">
                            <MdCurrencyRupee size={14} />
                            {formatPrice(booking.totalPrice)}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${statusStyles[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                            <StatusIcon size={12} />
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => setActionModal({ isOpen: true, booking, action: 'approved' })}
                                  className="px-3 py-1.5 text-xs font-bold text-success bg-green-100 rounded-xl hover:bg-green-200 transition-colors cursor-pointer"
                                >
                                  <MdCheckCircle size={14} className="inline mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => setActionModal({ isOpen: true, booking, action: 'rejected' })}
                                  className="px-3 py-1.5 text-xs font-bold text-danger bg-red-100 rounded-xl hover:bg-red-200 transition-colors cursor-pointer"
                                >
                                  <MdCancel size={14} className="inline mr-1" />
                                  Reject
                                </button>
                              </>
                            )}
                            {booking.status === 'approved' && (
                              <button
                                onClick={() => setActionModal({ isOpen: true, booking, action: 'completed' })}
                                className="px-3 py-1.5 text-xs font-bold text-success bg-green-100 rounded-xl hover:bg-green-200 transition-colors cursor-pointer"
                              >
                                <MdCheckCircle size={14} className="inline mr-1" />
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {filtered.map((booking) => {
                const StatusIcon = statusIcons[booking.status] || MdAutorenew
                return (
                  <div key={booking.id} className="bg-white border border-border-light rounded-xl p-4 shadow-card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-text-primary font-bold">{booking.userName || 'Unknown'}</h3>
                        <p className="text-xs text-text-muted">{booking.userEmail}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${statusStyles[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                        <StatusIcon size={12} />
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-text-secondary mb-3">
                      <p className="flex items-center gap-1"><MdDirectionsCar size={14} /> {booking.carName || 'N/A'}</p>
                      <p className="flex items-center gap-1"><MdDateRange size={14} /> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                      <p className="flex items-center gap-1 text-brand font-bold"><MdCurrencyRupee size={14} /> {formatPrice(booking.totalPrice)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => setActionModal({ isOpen: true, booking, action: 'approved' })} className="flex-1 px-3 py-2 text-xs font-bold text-success bg-green-100 rounded-xl hover:bg-green-200 transition-colors cursor-pointer">Approve</button>
                          <button onClick={() => setActionModal({ isOpen: true, booking, action: 'rejected' })} className="flex-1 px-3 py-2 text-xs font-bold text-danger bg-red-100 rounded-xl hover:bg-red-200 transition-colors cursor-pointer">Reject</button>
                        </>
                      )}
                      {booking.status === 'approved' && (
                        <button onClick={() => setActionModal({ isOpen: true, booking, action: 'completed' })} className="flex-1 px-3 py-2 text-xs font-bold text-success bg-green-100 rounded-xl hover:bg-green-200 transition-colors cursor-pointer">Mark Completed</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, booking: null, action: '' })}
        onConfirm={handleAction}
        title={getActionLabel(actionModal.action)}
        message={`Are you sure you want to ${getActionLabel(actionModal.action).toLowerCase()} the booking for "${actionModal.booking?.carName}" by ${actionModal.booking?.userName}?`}
        confirmText={getActionLabel(actionModal.action)}
        confirmVariant={actionModal.action === 'rejected' ? 'danger' : 'warning'}
      />
    </div>
  )
}
