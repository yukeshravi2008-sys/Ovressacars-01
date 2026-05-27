import { useState, useEffect } from 'react'
import { MdDirectionsCar, MdSearch, MdCheckCircle } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { getAllCars } from '../../firebase/carService'
import { createBooking } from '../../firebase/bookingService'
import Navbar from '../../components/Navbar'
import CarCard from '../../components/CarCard'
import SkeletonCard from '../../components/SkeletonCard'
import ScrollReveal from '../../components/ScrollReveal'
import toast from 'react-hot-toast'

const carTypes = ['All', 'Hatchback', 'Sedan', 'SUV', 'Luxury']
const sortOptions = ['Default', 'Price: Low to High', 'Price: High to Low', 'Name: A-Z', 'Name: Z-A']

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

export default function CarList() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [sortBy, setSortBy] = useState('Default')
  const [showSort, setShowSort] = useState(false)

  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [bookingName, setBookingName] = useState('')
  const [bookingPhone, setBookingPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const totalDays = calcDays(pickupDate, returnDate)
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

  useEffect(() => {
    if (pickupDate && returnDate && new Date(returnDate) <= new Date(pickupDate)) {
      setReturnDate('')
    }
  }, [pickupDate, returnDate])

  const fetchCars = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllCars()
      setCars(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  let filtered = [...cars]

  if (activeTab !== 'All') {
    filtered = filtered.filter((c) => c.type === activeTab)
  }

  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.brand?.toLowerCase().includes(q) ||
        c.type?.toLowerCase().includes(q)
    )
  }

  switch (sortBy) {
    case 'Price: Low to High':
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'Price: High to Low':
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    case 'Name: A-Z':
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      break
    case 'Name: Z-A':
      filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
      break
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!bookingName.trim() || !bookingPhone.trim() || !pickupDate || !returnDate) {
      toast.error('Please fill in all fields')
      return
    }
    if (!/^\d{10}$/.test(bookingPhone.replace(/\D/g, ''))) {
      toast.error('Enter a valid 10-digit phone number')
      return
    }
    if (totalDays < 1) {
      toast.error('Return date must be after pickup date')
      return
    }
    setSubmitting(true)
    try {
      await createBooking({
        customerName: bookingName.trim(),
        customerPhone: bookingPhone.replace(/\D/g, ''),
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        totalDays,
        status: 'pending',
      })
      const msg = encodeURIComponent(
        `Hi, I want to book a car from ${pickupDate} to ${returnDate}. Name: ${bookingName.trim()}, Phone: ${bookingPhone.replace(/\D/g, '')}`
      )
      window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank')
      toast.success('Booking request sent! We will confirm shortly.')
      setBookingName('')
      setBookingPhone('')
      setPickupDate('')
      setReturnDate('')
    } catch {
      toast.error('Failed to submit booking')
    }
    setSubmitting(false)
  }

  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(Number(p) || 0)

  return (
    <div className="min-h-screen bg-bg-primary overflow-x-hidden">
      <Navbar />

      {/* Header */}
      <section className="bg-bg-section/50 py-12 md:py-20 border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="slide-up">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand-gold mb-3 block">Explore Our Fleet</span>
              <h1 className="text-2xl sm:text-4xl font-bold font-display text-text-primary mb-4 tracking-[-1px]">Our Cars</h1>
              <p className="text-text-secondary text-[16px]">Select from our premium collection of well-maintained vehicles ready for your journey.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
        <ScrollReveal animation="slide-up" delay={100}>
          <div className="bg-white border border-border-light rounded-2xl shadow-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-5">
              <div className="relative flex-1 max-w-md">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                  <MdSearch size={18} className="text-[#ABABAB]" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cars by name or type..."
                  className="w-full pl-[42px] pr-4 py-3 bg-white border-[1.5px] border-[#E8E8E0] rounded-xl text-sm text-[#1F1F1F] placeholder:text-[#ABABAB] focus:outline-none focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)] transition-all"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="px-5 py-3 bg-white border-[1.5px] border-[#E8E8E0] rounded-xl text-sm font-medium text-text-secondary hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-200 flex items-center gap-2 justify-center sm:justify-start min-w-[180px] cursor-pointer"
                >
                  <span>{sortBy}</span>
                  <svg className={`w-4 h-4 transition-transform ${showSort ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showSort && (
                  <>
                    <div onClick={() => setShowSort(false)} className="fixed inset-0 z-10" />
                    <div className="absolute right-0 mt-2 w-full min-w-[180px] bg-white border border-border-light rounded-xl shadow-lg z-20 py-2">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setSortBy(opt); setShowSort(false) }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                            sortBy === opt
                              ? 'text-brand-gold font-semibold bg-accent-light'
                              : 'text-text-secondary hover:bg-bg-section'
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

            <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {carTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`flex-shrink-0 whitespace-nowrap px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer touch-target ${
                    activeTab === type
                      ? 'bg-[#C9A84C] border-[#C9A84C] text-white shadow-sm'
                      : 'bg-[#F4F3EE] border-[1.5px] border-[#E8E8E0] text-[#6B6B6B] hover:bg-[#FBF5E6] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Booking + Car Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Booking Panel */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-3xl border border-[#E8E8E0] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#E8E8E0]">
                <h3 className="text-sm font-bold text-[#1A1A1A]">Book a Car</h3>
                <p className="text-xs text-[#6B6B6B] mt-0.5">Fill in your details</p>
              </div>
              <form onSubmit={handleBookingSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] placeholder:text-[#ABABAB] outline-none focus:border-[#C9A84C] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] placeholder:text-[#ABABAB] outline-none focus:border-[#C9A84C] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Pickup Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      min={today}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      min={getMinReturnDate(pickupDate)}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E8E8E0] rounded-xl text-sm text-[#1A1A1A] outline-none focus:border-[#C9A84C] transition-all"
                    />
                  </div>
                </div>

                {totalDays > 0 && (
                  <div className="bg-[#FBF5E6] rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B6B6B]">Total Days</span>
                      <span className="font-bold text-[#1A1A1A]">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
                    </div>
                    <div className="border-t border-[#E8D9A8] pt-2 flex justify-between items-center">
                      <span className="font-semibold text-sm text-[#1A1A1A]">Booking Fee</span>
                      <span className="text-xs text-[#6B6B6B]">To be confirmed</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#C9A84C] text-white font-semibold rounded-xl hover:bg-[#A8872E] disabled:opacity-50 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <FaWhatsapp size={16} />
                      Send Inquiry
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-[11px] text-[#6B6B6B] flex items-center justify-center gap-1">
                    <MdCheckCircle size={12} className="text-green-500" />
                    Instant WhatsApp response
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Car Grid */}
          <div className="min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-danger mb-4 text-lg">Failed to load cars: {error}</p>
                <button
                  onClick={fetchCars}
                  className="px-6 py-2.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-gold-dark transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <MdDirectionsCar size={56} className="text-text-muted mx-auto mb-4" />
                <p className="text-text-muted text-xl font-medium">No cars match your search criteria.</p>
                <button
                  onClick={() => { setSearch(''); setActiveTab('All') }}
                  className="mt-6 px-6 py-2.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-gold-dark transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((car, idx) => (
                  <ScrollReveal key={car.id} animation="slide-up" delay={idx * 80}>
                    <CarCard car={car} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
