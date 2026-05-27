import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  MdSearch, MdCheckCircle, MdDirectionsCar,
  MdArrowForward, MdChevronLeft, MdChevronRight
} from 'react-icons/md'
import { FaWhatsapp, FaStar, FaCar } from 'react-icons/fa'
import { getAllCars } from '../../firebase/carService'
import CarCard from '../../components/CarCard'
import SkeletonCard from '../../components/SkeletonCard'
import Navbar from '../../components/Navbar'
import ScrollReveal from '../../components/ScrollReveal'

const steps = [
  { icon: MdSearch, title: 'Browse', desc: 'Explore our fleet and find your perfect car' },
  { icon: MdCheckCircle, title: 'Choose', desc: 'Select your dates and pickup location' },
  { icon: FaWhatsapp, title: 'WhatsApp', desc: 'Send us a message to confirm your booking' },
  { icon: MdDirectionsCar, title: 'Drive', desc: 'Pick up your car and hit the road' },
]

const features = [
  {
    title: 'No Hidden Charges',
    desc: 'Transparent pricing with no surprises. What you see is what you pay.',
    icon: MdCheckCircle,
  },
  {
    title: 'GPS Tracked Cars',
    desc: 'Every car is GPS tracked for your safety and peace of mind.',
    icon: MdDirectionsCar,
  },
  {
    title: '24/7 Support',
    desc: 'We are always available to help you, anytime, anywhere.',
    icon: FaWhatsapp,
  },
]

const carTypes = ['All', 'Hatchback', 'Sedan', 'SUV', 'Luxury']

const brands = [
  { name: 'Maruti', count: 12 },
  { name: 'Hyundai', count: 8 },
  { name: 'Toyota', count: 6 },
  { name: 'Honda', count: 5 },
  { name: 'Tata', count: 7 },
  { name: 'Kia', count: 4 },
]

const reviews = [
  {
    name: 'Ravi Kumar',
    city: 'Chennai',
    quote: 'Amazing service! The car was in pristine condition and the booking process was incredibly smooth. Will definitely rent again.',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    city: 'Bangalore',
    quote: 'Rented a car for a weekend trip and it was a fantastic experience. The WhatsApp confirmation made everything so convenient.',
    stars: 5,
  },
  {
    name: 'Arun Prakash',
    city: 'Hyderabad',
    quote: 'Premium cars at affordable prices. The driver option was perfect for our outstation trip. Highly recommended!',
    stars: 5,
  },
]

export default function Home() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [currentReview, setCurrentReview] = useState(0)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const city = import.meta.env.VITE_CITY || 'Your City'
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

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

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo')
    if (scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(scrollTo)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  }, [searchParams])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredByBrand = selectedBrand
    ? cars.filter((c) => c.brand?.toLowerCase() === selectedBrand.toLowerCase())
    : cars

  const filteredCars =
    activeTab === 'All'
      ? filteredByBrand
      : filteredByBrand.filter((c) => c.type === activeTab)

  const displayCars = filteredCars.slice(0, 6)

  const luxuryCars = cars.filter((c) => c.type === 'Luxury')

  const scrollToFleet = () => {
    const fleetSection = document.getElementById('fleet')
    if (fleetSection) fleetSection.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBrandClick = (brand) => {
    setSelectedBrand(selectedBrand === brand.name ? null : brand.name)
    const fleetSection = document.getElementById('fleet')
    if (fleetSection) fleetSection.scrollIntoView({ behavior: 'smooth' })
  }

  const nextReview = () =>
    setCurrentReview((prev) => (prev + 1) % reviews.length)
  const prevReview = () =>
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative flex items-center px-4 md:px-8 overflow-hidden bg-bg-primary py-10 md:py-16">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ECECEC 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute -top-[15%] -right-[10%] w-[45%] h-[55%] rounded-full bg-accent-light/50 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[15%] -left-[10%] w-[35%] h-[45%] rounded-full bg-accent-light/30 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center relative z-10">
          <div className="lg:col-span-6 text-left flex flex-col items-start">
            <ScrollReveal animation="fade" duration={600} delay={100} className="w-full">
              <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[3px] text-brand-gold bg-accent-light px-4 py-2 rounded-full border border-brand-gold/20 mb-6">
                Self Drive Car Rentals in {city}
              </span>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" duration={700} delay={200} className="w-full">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-display text-text-primary mb-4 md:mb-6 tracking-[-1px] md:tracking-[-2px] leading-tight">
                Drive on Your <br />
                <span className="text-brand-gold">Own Terms</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" duration={700} delay={300} className="w-full">
              <p className="text-text-secondary text-[15px] sm:text-[18px] max-w-lg mb-6 md:mb-10 leading-relaxed">
                Experience ultimate freedom. No driver, no limits. Choose from a
                curated fleet of premium, sanitized vehicles tailored for your
                journey.
              </p>
            </ScrollReveal>

            {/* CTA CARD */}
            <ScrollReveal animation="slide-up" duration={700} delay={400} className="w-full">
              <div className="bg-white border border-[#E8E8E0] rounded-3xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 md:p-7 max-w-[650px] w-full text-center sm:text-left">
                <div className="w-14 h-1 bg-[#C9A84C] rounded-full mb-5 mx-auto sm:mx-0" />
                <h3 className="text-5xl font-bold tracking-tight text-[#1A1A1A]">
                  Drive Your Way
                </h3>
                <div className="text-lg text-[#6B6B6B] leading-relaxed mt-2">
                  <p>Premium Self Drive Cars</p>
                  <p>Ready When You Are</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm text-[#6B6B6B] font-medium">
                      <MdCheckCircle size={18} className="text-[#C9A84C] shrink-0" />
                      Instant Confirmation
                    </p>
                    <p className="flex items-center gap-2 text-sm text-[#6B6B6B] font-medium">
                      <MdCheckCircle size={18} className="text-[#C9A84C] shrink-0" />
                      Premium Fleet
                    </p>
                    <p className="flex items-center gap-2 text-sm text-[#6B6B6B] font-medium">
                      <MdCheckCircle size={18} className="text-[#C9A84C] shrink-0" />
                      Flexible Rentals
                    </p>
                  </div>
                </div>
                <button
                  onClick={scrollToFleet}
                  className="mt-6 px-8 py-4 bg-[#C9A84C] text-white font-semibold rounded-xl shadow-md hover:bg-[#A8872E] hover:scale-105 transition-all duration-300 touch-target"
                >
                  Explore Cars
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" duration={700} delay={500} className="w-full mt-4 md:mt-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white border border-[#E8E8E0] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 md:p-5">
                <div className="text-center">
                  <p className="text-xl md:text-[24px] font-black font-display text-text-primary">
                    50+
                  </p>
                  <p className="text-[10px] md:text-[11px] text-text-muted font-semibold uppercase tracking-wider">
                    Fleet Cars
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-[24px] font-black font-display text-text-primary">
                    500+
                  </p>
                  <p className="text-[10px] md:text-[11px] text-text-muted font-semibold uppercase tracking-wider">
                    Happy Renters
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-[24px] font-black font-display text-text-primary">
                    24/7
                  </p>
                  <p className="text-[10px] md:text-[11px] text-text-muted font-semibold uppercase tracking-wider">
                    VIP Support
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-[24px] font-black font-display text-text-primary">
                    100+
                  </p>
                  <p className="text-[10px] md:text-[11px] text-text-muted font-semibold uppercase tracking-wider">
                    Destinations
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 relative w-full h-full min-h-[400px] lg:min-h-[550px] flex items-center justify-center">
            <ScrollReveal
              animation="scale-in"
              duration={800}
              delay={200}
              className="relative w-full max-w-[550px]"
            >
              <div className="absolute inset-0 border-2 border-dashed border-border-light/30 rounded-[32px] pointer-events-none scale-95" />
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-accent-light/20 border border-brand/10 rounded-full blur-xl animate-float" />

              <div className="relative rounded-[28px] overflow-hidden shadow-lg-custom border border-border-light/50 bg-bg-section/30">
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#FAFAF8]/95 via-[#FAFAF8]/60 to-transparent" />
                <img
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80"
                  alt="Premium car rental vehicle"
                  className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-700 ease-out"
                  fetchpriority="high"
                />

                <div className="absolute bottom-5 left-5 right-5 glass-panel px-6 py-5 rounded-2xl flex items-center justify-between border border-white/50 shadow-md">
                  <div>
                    <h4 className="text-base font-bold font-display text-text-primary">
                      Aston Martin DBS
                    </h4>
                    <p className="text-xs text-text-muted font-medium">
                      Available for Premium Hire
                    </p>
                  </div>
                  <span className="px-4 py-1.5 bg-brand-gold text-white font-bold rounded-full text-xs">
                    Luxury
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CAR BRANDS SECTION */}
      <section id="brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-10">
            <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand-gold mb-3 block">
              Top Brands
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary tracking-[-1px]">
              Rent a Car from Top Brands
            </h2>
          </div>
        </ScrollReveal>

        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide md:flex-wrap md:justify-center">
          {brands.map((brand) => (
            <button
              key={brand.name}
              onClick={() => handleBrandClick(brand)}
              className={`flex-shrink-0 flex items-center gap-2.5 bg-white border rounded-xl px-5 py-3 transition-all duration-200 cursor-pointer ${
                selectedBrand === brand.name
                  ? 'border-[#C9A84C] shadow-[0_0_0_2px_rgba(201,168,76,0.2)]'
                  : 'border-[#E8E8E0] hover:border-[#C9A84C]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#FBF5E6] flex items-center justify-center shrink-0">
                <FaCar size={14} className="text-[#C9A84C]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#1A1A1A]">{brand.name}</p>
                <p className="text-[11px] text-[#ABABAB] font-medium">
                  {brand.count} Cars
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SPECIAL OFFERS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center px-6 sm:px-10 py-8 md:py-10">
            <div className="flex-1 text-center md:text-left">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-[2px] px-3 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(201,168,76,0.2)', color: '#C9A84C' }}
              >
                Limited Offer
              </span>
              <h3 className="text-[28px] sm:text-[32px] font-black text-white leading-tight mb-3">
                Special Offers up to 25% Off
              </h3>
              <p className="text-sm" style={{ color: '#8888aa' }}>
                Book now and save big on your next adventure. Limited time offer.
              </p>
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#C9A84C] text-black font-extrabold rounded-xl hover:bg-[#B8972A] transition-colors text-sm"
              >
                View All Cars <MdArrowForward size={18} />
              </Link>
            </div>
            <div className="flex-shrink-0 mt-6 md:mt-0">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80"
                alt="Special offer car"
                className="w-56 sm:w-72 md:w-80 object-contain -rotate-6 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FLEET SECTION */}
      <section
        id="fleet"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20"
      >
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-12">
            <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand-gold mb-4 block">
              Our Collection
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-primary mb-4 tracking-[-1px]">
              Our Fleet
            </h2>
            <p className="text-text-secondary text-[16px] max-w-xl mx-auto">
              Choose from our wide range of well-maintained vehicles
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade" delay={100}>
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 scrollbar-hide justify-center mb-14">
            {carTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex-shrink-0 whitespace-nowrap px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === type
                    ? 'bg-[#C9A84C] border-[#C9A84C] text-white font-bold shadow-md'
                    : 'bg-[#F4F3EE] border-[1.5px] border-[#E8E8E0] text-[#6B6B6B] hover:bg-[#FBF5E6] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-danger mb-4">Failed to load cars: {error}</p>
            <button
              onClick={fetchCars}
              className="px-6 py-2.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-gold-dark transition-colors"
            >
              Retry
            </button>
          </div>
        ) : displayCars.length === 0 ? (
          <div className="text-center py-16">
            <MdDirectionsCar size={56} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg font-medium">
              {selectedBrand
                ? `No cars found for ${selectedBrand}`
                : 'No cars in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCars.map((car, idx) => (
              <ScrollReveal key={car.id} animation="slide-up" delay={idx * 100}>
                <CarCard car={car} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {cars.length > 6 && (
          <ScrollReveal animation="fade" delay={200}>
            <div className="text-center mt-14">
              <Link
                to="/cars"
                className="px-8 py-3.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-gold-dark transition-colors inline-block"
              >
                View All Cars
              </Link>
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* LUXURY CARS SECTION */}
      {luxuryCars.length > 0 && (
        <section className="bg-[#1A1A1A] py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="slide-up">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand-gold mb-3 block">
                    Premium Fleet
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-[-1px]">
                    Rent a Luxury & Sports Car
                  </h2>
                </div>
                <Link
                  to="/cars"
                  className="hidden sm:inline-flex items-center gap-1 text-[#C9A84C] text-sm font-bold hover:underline shrink-0"
                >
                  View all luxury <MdArrowForward size={16} />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {luxuryCars.slice(0, 3).map((car, idx) => (
                <ScrollReveal
                  key={car.id}
                  animation="slide-up"
                  delay={idx * 100}
                >
                  <CarCard car={car} showBookButton dark />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CAR WITH DRIVER */}
      <section
        id="with-driver"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <ScrollReveal animation="slide-up">
            <div className="rounded-3xl overflow-hidden h-[360px]">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80"
                alt="Car with driver"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal animation="slide-up" delay={150}>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[2px] text-brand-gold bg-accent-light px-3 py-1.5 rounded-full mb-4">
              With Driver
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-text-primary mb-4 tracking-[-1px]">
              Rent a Car with a Driver
            </h2>
            <p className="text-text-secondary text-[15px] mb-6 leading-relaxed">
              Professional drivers available for airport transfers, outstation
              trips and long journeys across {city}.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <MdCheckCircle size={20} className="text-[#C9A84C] shrink-0" />
                <span className="text-sm text-text-primary font-medium">
                  Verified professional drivers
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MdCheckCircle size={20} className="text-[#C9A84C] shrink-0" />
                <span className="text-sm text-text-primary font-medium">
                  Available 24/7
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MdCheckCircle size={20} className="text-[#C9A84C] shrink-0" />
                <span className="text-sm text-text-primary font-medium">
                  Outstation & local trips
                </span>
              </div>
            </div>
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello Ovressacars, I want to book a car with driver')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C9A84C] text-white font-extrabold rounded-xl hover:bg-[#A8872D] transition-colors text-sm"
            >
              Book with Driver <MdArrowForward size={18} />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-bg-section py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[35%] h-[35%] rounded-full bg-accent-light/40 blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-12">
              <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand-gold mb-4 block">
                Simple Process
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-primary tracking-[-1px]">
                How It Works
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <ScrollReveal
                  key={i}
                  animation="slide-up"
                  delay={i * 150}
                  className="text-center relative"
                >
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border-light" />
                  )}
                  <div className="w-[72px] h-[72px] mx-auto mb-5 rounded-2xl bg-[#FBF5E6] border-[1.5px] border-[#E8D9A8] p-4 flex items-center justify-center relative z-10">
                    <Icon size={32} className="text-[#C9A84C]" />
                  </div>
                  <div className="w-9 h-9 mx-auto mb-4 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-sm">
                    <span className="text-sm font-black text-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-text-primary mb-3 tracking-[-0.5px]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed px-4">
                    {step.desc}
                  </p>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        id="why-us"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20"
      >
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-12">
            <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand-gold mb-4 block">
              Why Us
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-primary tracking-[-1px]">
              Why Choose Us
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <ScrollReveal
                key={i}
                animation="slide-up"
                delay={i * 150}
                className="h-full"
              >
                <div className="bg-white border border-[#E8E8E0] rounded-2xl p-5 text-center card-hover shadow-[0_2px_8px_rgba(0,0,0,0.05)] h-full">
                  <div className="flex justify-center mb-3">
                    <Icon size={32} className="text-[#C9A84C]" />
                  </div>
                  <h3 className="text-base font-bold font-display text-text-primary mb-1.5 tracking-[-0.5px]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-[2px] px-3 py-1.5 rounded-full mb-4"
                style={{
                  background: 'rgba(201,168,76,0.2)',
                  color: '#C9A84C',
                }}
              >
                Client Reviews
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-[-1px] mb-6">
                Our Best Clients Reviews
              </h2>
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={prevReview}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <MdChevronLeft size={20} />
                </button>
                <button
                  onClick={nextReview}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <MdChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 sm:p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(reviews[currentReview].stars)].map((_, i) => (
                    <FaStar key={i} size={16} className="text-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-text-secondary text-[15px] italic leading-relaxed mb-6">
                  &ldquo;{reviews[currentReview].quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      {reviews[currentReview].name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {reviews[currentReview].city}
                    </p>
                  </div>
                  <Link
                    to="/cars"
                    className="text-[#C9A84C] text-sm font-bold hover:underline"
                  >
                    Book a car now &rarr;
                  </Link>
                </div>
              </div>
              <div className="flex lg:hidden items-center justify-center gap-3 mt-6">
                <button
                  onClick={prevReview}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <MdChevronLeft size={20} />
                </button>
                <button
                  onClick={nextReview}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <MdChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-bg-section py-12 md:py-16 lg:py-20 px-4 text-center overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-brand/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-accent-light/40 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollReveal animation="scale-in" duration={600}>
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold font-display text-text-primary mb-4 md:mb-6 tracking-[-1px] md:tracking-[-1.5px] leading-tight">
              Ready to Hit the Road?
            </h2>
            <p className="text-text-secondary mb-8 md:mb-10 text-[15px] sm:text-[18px] max-w-lg mx-auto">
              Book your self-drive car now via WhatsApp and receive a VIP booking
              experience.
            </p>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 md:px-10 py-3 md:py-4 bg-[#25D366] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(37,211,102,0.30)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(37,211,102,0.40)] transition-all duration-200 text-[16px] touch-target"
            >
              <FaWhatsapp size={22} />
              Book on WhatsApp
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-[#1A1A1A] border-t border-[#2A2A2A] relative z-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold font-display">
                <span className="text-white">Ovressa</span>
                <span className="text-[#C9A84C]">cars</span>
              </h3>
              <p className="text-sm text-[#6B6B6B] mt-3 leading-relaxed">
                Premium self-drive car rentals. Drive on your own terms.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-sm font-bold text-white mb-5">Quick Links</h4>
              <div className="space-y-3 text-sm text-[#6B6B6B]">
                <Link
                  to="/"
                  className="block hover:text-[#C9A84C] transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/cars"
                  className="block hover:text-[#C9A84C] transition-colors duration-200"
                >
                  Cars
                </Link>
                <button
                  onClick={() => {
                    const el = document.getElementById('brands')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="block hover:text-[#C9A84C] transition-colors duration-200 cursor-pointer"
                >
                  Car Brands
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('with-driver')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="block hover:text-[#C9A84C] transition-colors duration-200 cursor-pointer"
                >
                  With Driver
                </button>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-sm font-bold text-white mb-5">Contact & Offers</h4>
              <div className="space-y-3 text-sm text-[#6B6B6B] mb-6">
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-[#C9A84C] transition-colors duration-200"
                >
                  WhatsApp: {whatsapp}
                </a>
                <p>{city}</p>
                <p>contact@ovressacars.com</p>
              </div>
              <h4 className="text-sm font-bold text-white mb-3">
                Subscribe for exclusive deals
              </h4>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2.5 bg-transparent border border-[#2e2e3e] text-white rounded-xl text-sm outline-none focus:border-[#C9A84C] placeholder:text-[#6B6B6B] touch-target"
                />
                <button className="w-full px-4 py-2.5 bg-[#C9A84C] text-white font-bold rounded-xl hover:bg-[#A8872D] transition-colors text-sm cursor-pointer touch-target">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#2A2A2A] text-center text-sm text-[#6B6B6B]">
            &copy; 2026 Ovressacars. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
