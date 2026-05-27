import { useState, useEffect, useRef } from 'react'
import { MdClose, MdWhatsapp } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { createBooking } from '../firebase/bookingService'
import toast from 'react-hot-toast'

function getMinReturnDate(pickupDate) {
  if (!pickupDate) return ''
  const d = new Date(pickupDate)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

function calcDays(start, end) {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  const diff = e.getTime() - s.getTime()
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)))
}

export default function BookingModal({ isOpen, onClose, car }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const overlayRef = useRef()

  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

  useEffect(() => {
    if (isOpen) {
      setName('')
      setPhone('')
      setPickupDate('')
      setReturnDate('')
      setErrors({})
      setSubmitting(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (pickupDate && returnDate && new Date(returnDate) <= new Date(pickupDate)) {
      setReturnDate('')
    }
  }, [pickupDate, returnDate])

  const today = new Date().toISOString().split('T')[0]
  const totalDays = calcDays(pickupDate, returnDate)
  const totalPrice = totalDays * (Number(car?.pricePerDay) || 0)
  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(Math.round(p))

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Full name is required'
    if (!phone.trim()) errs.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(phone.replace(/\D/g, '')))
      errs.phone = 'Enter a valid 10-digit phone number'
    if (!pickupDate) errs.pickupDate = 'Pickup date is required'
    if (!returnDate) errs.returnDate = 'Return date is required'
    if (pickupDate && returnDate && totalDays < 1)
      errs.returnDate = 'Return date must be after pickup date'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await createBooking({
        customerName: name.trim(),
        customerPhone: phone.replace(/\D/g, ''),
        carId: car.id,
        carName: car.name,
        carType: car.type || '',
        pricePerDay: Number(car.pricePerDay) || 0,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        totalDays,
        totalPrice: Math.round(totalPrice),
      })

      const msg = encodeURIComponent(
        `Hi, I want to book ${car.name} from ${pickupDate} to ${returnDate}. My name is ${name.trim()}, Phone: ${phone.replace(/\D/g, '')}. Total: ₹${formatPrice(totalPrice)}`
      )
      window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank')

      toast.success('Booking request sent! We will confirm shortly.')
      onClose()
    } catch {
      toast.error('Failed to submit booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen || !car) return null

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_32px_64px_rgba(0,0,0,0.2)] animate-slide-up-sm">
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-xl font-bold font-display text-text-primary">
              Book {car.name}
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              ₹{formatPrice(car.pricePerDay)} / day
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-bg-section flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <MdClose size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={`w-full px-4 py-3 bg-[#F8F7F4] border rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] ${errors.name ? 'border-danger' : 'border-[#E8E8E0]'}`}
            />
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1.5">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className={`w-full px-4 py-3 bg-[#F8F7F4] border rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] ${errors.phone ? 'border-danger' : 'border-[#E8E8E0]'}`}
            />
            {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Pickup Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                value={pickupDate}
                min={today}
                onChange={(e) => setPickupDate(e.target.value)}
                className={`w-full px-4 py-3 bg-[#F8F7F4] border rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] ${errors.pickupDate ? 'border-danger' : 'border-[#E8E8E0]'}`}
              />
              {errors.pickupDate && <p className="text-xs text-danger mt-1">{errors.pickupDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                Return Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                value={returnDate}
                min={getMinReturnDate(pickupDate)}
                onChange={(e) => setReturnDate(e.target.value)}
                className={`w-full px-4 py-3 bg-[#F8F7F4] border rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] ${errors.returnDate ? 'border-danger' : 'border-[#E8E8E0]'}`}
              />
              {errors.returnDate && <p className="text-xs text-danger mt-1">{errors.returnDate}</p>}
            </div>
          </div>

          {totalDays > 0 && (
            <div className="bg-[#FBF5E6] rounded-xl p-4 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Total Days</span>
                <span className="font-bold text-text-primary">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Price per day</span>
                <span className="font-bold text-text-primary">₹{formatPrice(car.pricePerDay)}</span>
              </div>
              <div className="flex justify-between text-base pt-1.5 border-t border-[#E8D9A8]">
                <span className="font-semibold text-text-primary">Total Price</span>
                <span className="font-black text-[#C9A84C]">₹{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#25D366] text-white font-extrabold rounded-xl hover:bg-[#1DA851] disabled:opacity-60 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              'Submitting...'
            ) : (
              <>
                <FaWhatsapp size={18} />
                Confirm & Book via WhatsApp
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
