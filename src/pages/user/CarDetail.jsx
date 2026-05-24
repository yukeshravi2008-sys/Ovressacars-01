import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MdArrowBack, MdPeople, MdSpeed, MdLocalGasStation, MdCalendarToday, MdCheckCircle } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { getCarById } from '../../firebase/carService'
import Navbar from '../../components/Navbar'
import LoadingSpinner from '../../components/LoadingSpinner'
import ScrollReveal from '../../components/ScrollReveal'

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'
  const brand = import.meta.env.VITE_BRAND_NAME || 'Ovressacars'

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getCarById(id)
        if (!data) throw new Error('Car not found')
        setCar(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCar()
  }, [id])

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello ${brand}, I want to book ${car?.name || 'a car'}`
    )
    window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank')
  }

  if (loading) return <LoadingSpinner fullScreen />

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <p className="text-danger text-lg font-medium mb-4">{error}</p>
          <button
            onClick={() => navigate('/cars')}
            className="px-8 py-3 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-colors cursor-pointer"
          >
            Back to Cars
          </button>
        </div>
      </div>
    )
  }

  const imageUrl = car?.image || car?.images?.[0] || ''

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Back */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <MdArrowBack size={18} />
          Back
        </button>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Image */}
          <ScrollReveal animation="scale-in" className="lg:col-span-7">
            <div className="bg-white border border-border-light rounded-3xl overflow-hidden shadow-card">
              <img
                src={imageUrl}
                alt={car?.name || 'Car'}
                className="w-full h-[420px] sm:h-[480px] object-cover object-center"
                onError={(e) => { e.target.src = '/placeholder-car.png' }}
              />
            </div>
          </ScrollReveal>

          {/* Details */}
          <ScrollReveal animation="slide-up" delay={150} className="lg:col-span-5">
            <div className="bg-white border border-border-light rounded-3xl p-8 shadow-card sticky top-24">
              <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand mb-2 block">
                {car?.type || 'Vehicle'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary mb-6 tracking-[-1px]">
                {car?.brand ? `${car.brand} ${car.name}` : car?.name}
              </h1>

              {/* Price */}
              <div className="flex items-end gap-2 mb-8">
                <span className="text-4xl font-black font-display text-brand">₹{car?.price || '—'}</span>
                <span className="text-sm text-text-muted mb-1.5 font-medium">/ day</span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: MdPeople, label: 'Seats', value: car?.seats || '—' },
                  { icon: MdSpeed, label: 'Transmission', value: car?.transmission || '—' },
                  { icon: MdLocalGasStation, label: 'Fuel', value: car?.fuelType || '—' },
                  { icon: MdCalendarToday, label: 'Model Year', value: car?.year || '—' },
                ].map((spec, i) => {
                  const Icon = spec.icon
                  return (
                    <div key={i} className="flex items-center gap-3 bg-bg-section rounded-xl p-4 border border-border-light/50">
                      <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-brand" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{spec.label}</p>
                        <p className="text-sm font-bold text-text-primary truncate">{spec.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Features */}
              {car?.features?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold font-display text-text-primary mb-4">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-light text-brand text-xs font-semibold rounded-full border border-brand/20">
                        <MdCheckCircle size={13} />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {car?.description && (
                <p className="text-sm text-text-secondary leading-relaxed mb-8">{car.description}</p>
              )}

              {/* CTA */}
              <button
                onClick={handleWhatsApp}
                className="w-full py-4 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-all duration-250 text-[16px] inline-flex items-center justify-center gap-3 shadow-lg cursor-pointer btn-shine-parent"
              >
                <FaWhatsapp size={22} />
                Book Now via WhatsApp
                <span className="btn-shine" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
