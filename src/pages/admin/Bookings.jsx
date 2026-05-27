import { useState, useEffect, useMemo } from 'react'
import {
  MdCheckCircle, MdCancel, MdAutorenew, MdSearch,
  MdDirectionsCar, MdDateRange, MdCurrencyRupee, MdWhatsapp,
  MdEdit, MdDelete, MdNotes, MdDownload, MdClose,
  MdArrowDropDown, MdSort, MdMoreVert
} from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import {
  subscribeBookings, updateBookingStatus, updateBookingWithLog, deleteBooking
} from '../../firebase/bookingService'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled']
const filterOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']
const sortOptions = ['Newest First', 'Oldest First', 'Highest Revenue']

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [sortBy, setSortBy] = useState('Newest First')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [editModal, setEditModal] = useState({ isOpen: false, booking: null })
  const [editForm, setEditForm] = useState({
    customerName: '',
    customerPhone: '',
    pickupDate: '',
    returnDate: '',
    status: 'pending',
    adminNote: '',
  })
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, booking: null })
  const [expandedNote, setExpandedNote] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const { currentUser } = useAuth()
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

  useEffect(() => {
    const unsub = subscribeBookings((data) => {
      setBookings(data)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const pendingCount = useMemo(
    () => bookings.filter((b) => b.status === 'pending').length,
    [bookings]
  )

  const revenue = useMemo(
    () =>
      bookings
        .filter((b) => b.status === 'completed')
        .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0),
    [bookings]
  )

  const filtered = useMemo(() => {
    let result = [...bookings]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.customerName?.toLowerCase().includes(q) ||
          b.customerPhone?.includes(q) ||
          b.carName?.toLowerCase().includes(q)
      )
    }

    if (filter !== 'All') {
      result = result.filter((b) => b.status === filter.toLowerCase())
    }

    switch (sortBy) {
      case 'Oldest First':
        result.sort((a, b) => {
          const ta = a.createdAt?.toDate?.()?.getTime() || 0
          const tb = b.createdAt?.toDate?.()?.getTime() || 0
          return ta - tb
        })
        break
      case 'Highest Revenue':
        result.sort((a, b) => (Number(b.totalPrice) || 0) - (Number(a.totalPrice) || 0))
        break
      default:
        result.sort((a, b) => {
          const ta = a.createdAt?.toDate?.()?.getTime() || 0
          const tb = b.createdAt?.toDate?.()?.getTime() || 0
          return tb - ta
        })
    }

    return result
  }, [bookings, search, filter, sortBy])

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const formatDateInput = (date) => {
    if (!date) return ''
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toISOString().split('T')[0]
  }

  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(Number(p) || 0)

  const openWhatsApp = (booking) => {
    const msg = encodeURIComponent(
      `Hello! This is regarding your booking for ${booking.carName}.`
    )
    const phone = booking.customerPhone || whatsapp
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank')
  }

  const handleStatusChange = async (booking, newStatus) => {
    try {
      await updateBookingWithLog(booking.id, { status: newStatus }, currentUser?.email)
      toast.success(`Status changed to ${statusLabels[newStatus]}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleComplete = async (booking) => {
    try {
      await updateBookingWithLog(booking.id, { status: 'completed' }, currentUser?.email)
      toast.success('Booking marked as completed')
    } catch {
      toast.error('Failed to complete booking')
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm.booking) return
    try {
      await deleteBooking(deleteConfirm.booking.id, currentUser?.email)
      toast.success('Booking deleted and archived')
    } catch {
      toast.error('Failed to delete booking')
    }
    setDeleteConfirm({ isOpen: false, booking: null })
  }

  const openEditModal = (booking) => {
    setEditForm({
      customerName: booking.customerName || '',
      customerPhone: booking.customerPhone || '',
      pickupDate: formatDateInput(booking.pickupDate),
      returnDate: formatDateInput(booking.returnDate),
      status: booking.status || 'pending',
      adminNote: booking.adminNote || '',
    })
    setEditModal({ isOpen: true, booking })
  }

  const handleEditSave = async () => {
    if (!editModal.booking) return
    const { customerName, customerPhone, pickupDate, returnDate, status, adminNote } = editForm
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Name and phone are required')
      return
    }
    try {
      await updateBookingWithLog(
        editModal.booking.id,
        { customerName, customerPhone, pickupDate, returnDate, status, adminNote },
        currentUser?.email
      )
      toast.success('Booking updated')
      setEditModal({ isOpen: false, booking: null })
    } catch {
      toast.error('Failed to update booking')
    }
  }

  const handleNoteSave = async (booking) => {
    if (!booking) return
    setSavingNote(true)
    try {
      await updateBookingWithLog(booking.id, { adminNote: noteText }, currentUser?.email)
      toast.success('Note saved')
      setExpandedNote(null)
    } catch {
      toast.error('Failed to save note')
    }
    setSavingNote(false)
  }

  const handleExportCSV = () => {
    const headers = ['Customer Name', 'Phone', 'Car', 'Pickup Date', 'Return Date', 'Days', 'Total Price', 'Status', 'Admin Note']
    const rows = filtered.map((b) => [
      b.customerName || '',
      b.customerPhone || '',
      b.carName || '',
      formatDate(b.pickupDate),
      formatDate(b.returnDate),
      b.totalDays || '',
      b.totalPrice || '',
      b.status || '',
      b.adminNote || '',
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Bookings exported')
  }

  const statusButton = (booking) => {
    const status = booking.status
    if (status === 'pending') {
      return (
        <button
          onClick={() => handleStatusChange(booking, 'confirmed')}
          className="px-3 py-1.5 text-xs font-bold text-green-700 bg-green-100 rounded-xl hover:bg-green-200 transition-colors cursor-pointer touch-target flex items-center gap-1"
        >
          <MdCheckCircle size={13} />
          Confirm
        </button>
      )
    }
    if (status === 'confirmed') {
      return (
        <button
          onClick={() => handleComplete(booking)}
          className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 rounded-xl hover:bg-blue-200 transition-colors cursor-pointer touch-target flex items-center gap-1"
        >
          <MdCheckCircle size={13} />
          Mark Completed
        </button>
      )
    }
    return null
  }

  const ActionButtons = ({ booking }) => (
    <div className="flex items-center gap-1.5 flex-wrap">
      {statusButton(booking)}
      <button
        onClick={() => openEditModal(booking)}
        className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer touch-target flex items-center gap-1"
        title="Edit booking"
      >
        <MdEdit size={13} />
        <span className="hidden sm:inline">Edit</span>
      </button>
      <button
        onClick={() => openWhatsApp(booking)}
        className="p-1.5 text-[#25D366] hover:text-[#1DA851] transition-colors cursor-pointer touch-target"
        title="WhatsApp customer"
      >
        <FaWhatsapp size={16} />
      </button>
      <button
        onClick={() => {
          setExpandedNote(expandedNote === booking.id ? null : booking.id)
          setNoteText(booking.adminNote || '')
        }}
        className="p-1.5 text-gray-400 hover:text-yellow-600 transition-colors cursor-pointer touch-target"
        title="Add note"
      >
        <MdNotes size={16} />
      </button>
      <button
        onClick={() => setDeleteConfirm({ isOpen: true, booking })}
        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer touch-target"
        title="Delete booking"
      >
        <MdDelete size={16} />
      </button>
    </div>
  )

  const statusDot = (status) => {
    const colors = {
      pending: 'bg-yellow-400',
      confirmed: 'bg-green-400',
      completed: 'bg-blue-400',
      cancelled: 'bg-red-400',
    }
    return <span className={`w-1.5 h-1.5 rounded-full inline-block ${colors[status] || 'bg-gray-400'}`} />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8F7F4]">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-white border border-[#E8E8E0] rounded-2xl animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8F7F4]">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1A1A1A] font-display">Booking Requests</h1>
              {pendingCount > 0 && (
                <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  Pending ({pendingCount})
                </span>
              )}
            </div>
            <p className="text-sm text-[#6B6B6B] mt-1 font-medium">
              {bookings.length} total &middot; Revenue: ₹{formatPrice(revenue)}
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-[#E8E8E0] text-[#1A1A1A] text-sm font-semibold rounded-xl hover:bg-[#F8F7F4] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200 flex items-center gap-2 self-start touch-target"
          >
            <MdDownload size={16} />
            Export CSV
          </button>
        </div>

        {/* Search + Filters + Sort */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ABABAB] pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, phone, or car..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] placeholder:text-[#ABABAB] outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] transition-all"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="px-4 py-2.5 bg-white border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] font-medium hover:border-[#C9A84C] transition-all flex items-center gap-2 touch-target w-full sm:w-auto"
            >
              <MdSort size={16} />
              {sortBy}
              <MdArrowDropDown size={18} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showSortDropdown && (
              <>
                <div onClick={() => setShowSortDropdown(false)} className="fixed inset-0 z-10" />
                <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E8E8E0] rounded-xl shadow-lg z-20 py-1.5">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSortDropdown(false) }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                        sortBy === opt
                          ? 'text-[#C9A84C] font-semibold bg-[#FBF5E6]'
                          : 'text-[#6B6B6B] hover:bg-[#F8F7F4]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 whitespace-nowrap touch-target ${
                filter === opt
                  ? 'bg-[#C9A84C] text-white shadow-md'
                  : 'bg-white border border-[#E8E8E0] text-[#6B6B6B] hover:border-[#C9A84C] hover:text-[#C9A84C]'
              }`}
            >
              {opt}
              {opt !== 'All' && (
                <span className="ml-1.5 opacity-70">
                  ({bookings.filter((b) => b.status === opt.toLowerCase()).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <MdDirectionsCar size={48} className="text-[#ABABAB] mx-auto mb-4" />
            <p className="text-[#6B6B6B] font-medium">No bookings found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto rounded-2xl border border-[#E8E8E0]">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className="text-[#6B6B6B] text-xs uppercase border-b border-[#E8E8E0] bg-[#FAFAF7]">
                    <th className="text-left p-4 font-semibold">Customer</th>
                    <th className="text-left p-4 font-semibold">Car & Dates</th>
                    <th className="text-left p-4 font-semibold">Price</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold w-[200px]">Notes</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking) => (
                    <tr key={booking.id} className="border-b border-[#E8E8E0] last:border-0 hover:bg-[#FAFAF7]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#FBF5E6] flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-[#C9A84C]">
                              {(booking.customerName || '?').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[#1A1A1A] font-semibold truncate">{booking.customerName || 'N/A'}</p>
                            <a
                              href={`tel:${booking.customerPhone}`}
                              className="text-xs text-[#6B6B6B] hover:text-[#C9A84C] transition-colors"
                            >
                              {booking.customerPhone || '—'}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-[#1A1A1A] font-medium">{booking.carName || 'N/A'}</p>
                        <div className="flex items-center gap-1 text-xs text-[#6B6B6B] mt-0.5">
                          <MdDateRange size={12} />
                          <span>{formatDate(booking.pickupDate)} &rarr; {formatDate(booking.returnDate)}</span>
                        </div>
                        {booking.totalDays && (
                          <span className="text-[11px] text-[#ABABAB]">{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-[#1A1A1A] font-bold flex items-center gap-1">
                          <MdCurrencyRupee size={14} />
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="relative">
                          <select
                            value={booking.status || 'pending'}
                            onChange={(e) => handleStatusChange(booking, e.target.value)}
                            className={`appearance-none px-3 py-1.5 pr-7 text-xs font-bold rounded-full border-0 outline-none cursor-pointer ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{statusLabels[s]}</option>
                            ))}
                          </select>
                          <MdArrowDropDown size={14} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {booking.updatedBy && (
                          <p className="text-[10px] text-[#ABABAB] mt-1">by {booking.updatedBy}</p>
                        )}
                      </td>
                      <td className="p-4">
                        {expandedNote === booking.id ? (
                          <div className="flex gap-1.5">
                            <textarea
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Add admin note..."
                              className="flex-1 min-h-[36px] px-2 py-1.5 text-xs bg-[#F8F7F4] border border-[#E8E8E0] rounded-lg outline-none focus:border-[#C9A84C] resize-none"
                              rows={2}
                            />
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleNoteSave(booking)}
                                disabled={savingNote}
                                className="px-2 py-1 text-xs font-bold text-white bg-[#C9A84C] rounded-lg hover:bg-[#A8872D] transition-colors disabled:opacity-50 touch-target"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setExpandedNote(null)}
                                className="px-2 py-1 text-xs font-medium text-[#6B6B6B] border border-[#E8E8E0] rounded-lg hover:bg-[#F8F7F4] transition-colors touch-target"
                              >
                                <MdClose size={12} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setExpandedNote(booking.id)
                              setNoteText(booking.adminNote || '')
                            }}
                            className="text-xs text-left w-full group"
                          >
                            {booking.adminNote ? (
                              <span className="text-[#6B6B6B] line-clamp-2">{booking.adminNote}</span>
                            ) : (
                              <span className="text-[#ABABAB] italic group-hover:text-[#C9A84C] transition-colors">+ Add note</span>
                            )}
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <ActionButtons booking={booking} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {filtered.map((booking) => (
                <div key={booking.id} className="bg-white border border-[#E8E8E0] rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-[#FBF5E6] flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-[#C9A84C]">
                          {(booking.customerName || '?').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[#1A1A1A] font-bold truncate">{booking.customerName || 'Unknown'}</h3>
                        <p className="text-xs text-[#6B6B6B]">{booking.customerPhone || '—'}</p>
                      </div>
                    </div>
                    <select
                      value={booking.status || 'pending'}
                      onChange={(e) => handleStatusChange(booking, e.target.value)}
                      className={`text-xs font-bold rounded-full px-2.5 py-1 border-0 outline-none appearance-none cursor-pointer ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 text-sm text-[#6B6B6B] mb-3">
                    <p className="flex items-center gap-1.5">
                      <MdDirectionsCar size={14} className="shrink-0 text-[#ABABAB]" />
                      <span className="text-[#1A1A1A] font-medium">{booking.carName || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MdDateRange size={14} className="shrink-0 text-[#ABABAB]" />
                      <span>{formatDate(booking.pickupDate)} &rarr; {formatDate(booking.returnDate)}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MdCurrencyRupee size={14} className="shrink-0 text-[#ABABAB]" />
                      <span className="text-[#1A1A1A] font-bold">₹{formatPrice(booking.totalPrice)}</span>
                      {booking.totalDays && <span className="text-xs text-[#ABABAB]">({booking.totalDays} day{booking.totalDays > 1 ? 's' : ''})</span>}
                    </p>
                  </div>

                  {/* Mobile notes */}
                  <div className="mb-3">
                    {expandedNote === booking.id ? (
                      <div className="flex gap-1.5">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add admin note..."
                          className="flex-1 min-h-[36px] px-2 py-1.5 text-xs bg-[#F8F7F4] border border-[#E8E8E0] rounded-lg outline-none focus:border-[#C9A84C] resize-none"
                          rows={2}
                        />
                        <div className="flex flex-col gap-1">
                          <button onClick={() => handleNoteSave(booking)} disabled={savingNote} className="px-2 py-1 text-xs font-bold text-white bg-[#C9A84C] rounded-lg hover:bg-[#A8872D] transition-colors disabled:opacity-50 touch-target">Save</button>
                          <button onClick={() => setExpandedNote(null)} className="px-2 py-1 text-xs font-medium text-[#6B6B6B] border border-[#E8E8E0] rounded-lg hover:bg-[#F8F7F4] transition-colors touch-target"><MdClose size={12} /></button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setExpandedNote(booking.id); setNoteText(booking.adminNote || '') }}
                        className="text-xs w-full text-left group"
                      >
                        {booking.adminNote ? (
                          <span className="text-[#6B6B6B] line-clamp-2">{booking.adminNote}</span>
                        ) : (
                          <span className="text-[#ABABAB] italic group-hover:text-[#C9A84C] transition-colors">+ Add admin note</span>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#E8E8E0]">
                    <ActionButtons booking={booking} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setEditModal({ isOpen: false, booking: null })}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-lg-custom border border-[#E8E8E0]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#1A1A1A] font-display">Edit Booking</h2>
              <button onClick={() => setEditModal({ isOpen: false, booking: null })} className="p-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors cursor-pointer">
                <MdClose size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Customer Name</label>
                <input
                  type="text"
                  value={editForm.customerName}
                  onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.customerPhone}
                  onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Pickup Date</label>
                  <input
                    type="date"
                    value={editForm.pickupDate}
                    onChange={(e) => setEditForm({ ...editForm, pickupDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Return Date</label>
                  <input
                    type="date"
                    value={editForm.returnDate}
                    onChange={(e) => setEditForm({ ...editForm, returnDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] transition-all"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{statusLabels[s]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-1.5">Admin Note</label>
                <textarea
                  value={editForm.adminNote}
                  onChange={(e) => setEditForm({ ...editForm, adminNote: e.target.value })}
                  placeholder="e.g. Customer requested airport pickup"
                  className="w-full px-4 py-2.5 bg-white border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.1)] transition-all resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setEditModal({ isOpen: false, booking: null })}
                className="flex-1 px-4 py-3 text-sm font-medium text-[#6B6B6B] border border-[#E8E8E0] rounded-xl hover:bg-[#F8F7F4] transition-colors touch-target"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-[#C9A84C] rounded-xl hover:bg-[#A8872D] transition-colors touch-target"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm({ isOpen: false, booking: null })}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg-custom border border-[#E8E8E0] text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <MdDelete size={28} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Delete this booking permanently?</h3>
            <p className="text-sm text-[#6B6B6B] mb-2">
              This will remove the booking for <strong>{deleteConfirm.booking?.carName}</strong> by <strong>{deleteConfirm.booking?.customerName}</strong>.
            </p>
            <p className="text-xs text-[#ABABAB] mb-6">The record will be archived in deleted bookings.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, booking: null })}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-[#6B6B6B] border border-[#E8E8E0] rounded-xl hover:bg-[#F8F7F4] transition-colors touch-target"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors touch-target"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}