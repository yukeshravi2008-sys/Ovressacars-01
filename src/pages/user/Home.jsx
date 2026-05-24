import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdSearch, MdCheckCircle, MdDirectionsCar } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
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

export default function Home() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
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

  const filteredCars = activeTab === 'All'
    ? cars
    : cars.filter((c) => c.type === activeTab)

  const displayCars = filteredCars.slice(0, 6)

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-bg-primary pt-8 pb-20">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ECECEC 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="absolute -top-[15%] -right-[10%] w-[45%] h-[55%] rounded-full bg-accent-light/50 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[15%] -left-[10%] w-[35%] h-[45%] rounded-full bg-accent-light/30 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">

          {/* Left Column */}
          <div className="lg:col-span-6 text-left flex flex-col items-start">
            <ScrollReveal animation="fade" duration={600} delay={100} className="w-full">
              <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[3px] text-brand bg-accent-light px-4 py-2 rounded-full border border-brand/20 mb-6">
                Self Drive Car Rentals in {city}
              </span>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" duration={700} delay={200} className="w-full">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[72px] font-black font-display text-text-primary mb-6 tracking-[-2px] leading-[1.05]">
                Drive on Your <br/>
                <span className="text-brand">Own Terms</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" duration={700} delay={300} className="w-full">
              <p className="text-text-secondary text-[17px] sm:text-[18px] max-w-lg mb-10 leading-relaxed">
                Experience ultimate freedom. No driver, no limits. Choose from a curated fleet of premium, sanitized vehicles tailored for your journey.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="slide-up" duration={700} delay={400} className="w-full flex flex-wrap gap-4 mb-12">
              <button
                onClick={() => navigate('/cars')}
                className="px-8 py-4 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-all duration-250 text-[15px] shadow-lg flex-1 sm:flex-none btn-shine-parent text-center cursor-pointer"
              >
                Browse Cars
                <span className="btn-shine" />
              </button>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-text-primary font-semibold border-2 border-border-light rounded-xl hover:border-brand hover:text-brand transition-all duration-250 text-[15px] inline-flex items-center justify-center gap-2.5 flex-1 sm:flex-none shadow-sm"
              >
                <FaWhatsapp size={20} className="text-whatsapp" />
                WhatsApp Us
              </a>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal animation="slide-up" duration={700} delay={500} className="w-full">
              <div className="flex items-center bg-white border border-border-light rounded-2xl shadow-card px-8 py-5 divide-x divide-border-light">
                <div className="text-center pr-8">
                  <p className="text-[24px] font-black font-display text-text-primary">50+</p>
                  <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Fleet Cars</p>
                </div>
                <div className="text-center px-8">
                  <p className="text-[24px] font-black font-display text-text-primary">500+</p>
                  <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Happy Renters</p>
                </div>
                <div className="text-center pl-8">
                  <p className="text-[24px] font-black font-display text-text-primary">24/7</p>
                  <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">VIP Support</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 relative w-full h-full min-h-[400px] lg:min-h-[550px] flex items-center justify-center">
            <ScrollReveal animation="scale-in" duration={800} delay={200} className="relative w-full max-w-[550px]">
              <div className="absolute inset-0 border-2 border-dashed border-border-light/30 rounded-[32px] pointer-events-none scale-95" />
              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-accent-light/20 border border-brand/10 rounded-full blur-xl animate-float" />

              <div className="relative rounded-[28px] overflow-hidden shadow-lg-custom border border-border-light/50 bg-bg-section/30">
                <img
                  src="/hero-car.png"
                  alt="Luxury Rental Car"
                  className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute bottom-5 left-5 right-5 glass-panel px-6 py-5 rounded-2xl flex items-center justify-between border border-white/50 shadow-md">
                  <div>
                    <h4 className="text-base font-bold font-display text-text-primary">Aston Martin DBS</h4>
                    <p className="text-xs text-text-muted font-medium">Available for Premium Hire</p>
                  </div>
                  <span className="px-4 py-1.5 bg-brand text-white font-bold rounded-full text-xs">
                    Luxury
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand mb-4 block">Our Collection</span>
            <h2 className="text-4xl sm:text-5xl font-bold font-display text-text-primary mb-4 tracking-[-1px]">Our Fleet</h2>
            <p className="text-text-secondary text-[16px] max-w-xl mx-auto">Choose from our wide range of well-maintained vehicles</p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade" delay={100}>
          <div className="flex flex-wrap gap-3 justify-center mb-14">
            {carTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  activeTab === type
                    ? 'bg-[#1F1F1F] text-white font-bold shadow-md'
                    : 'bg-white text-text-secondary border border-border-light hover:border-brand hover:text-brand'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-danger mb-4">Failed to load cars: {error}</p>
            <button
              onClick={fetchCars}
              className="px-6 py-2.5 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-colors"
            >
              Retry
            </button>
          </div>
        ) : displayCars.length === 0 ? (
          <div className="text-center py-16">
            <MdDirectionsCar size={56} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg font-medium">No cars in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="px-8 py-3.5 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-colors inline-block"
              >
                View All Cars
              </Link>
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-bg-section py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[35%] h-[35%] rounded-full bg-accent-light/40 blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand mb-4 block">Simple Process</span>
              <h2 className="text-4xl sm:text-5xl font-bold font-display text-text-primary tracking-[-1px]">How It Works</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <ScrollReveal key={i} animation="slide-up" delay={i * 150} className="text-center relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border-light" />
                  )}
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-accent-light border border-brand/20 flex items-center justify-center relative z-10">
                    <Icon size={30} className="text-brand" />
                  </div>
                  <div className="w-8 h-8 mx-auto mb-4 rounded-full bg-[#1F1F1F] flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-white">{i + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-text-primary mb-3">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed px-4">{step.desc}</p>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <ScrollReveal animation="slide-up">
          <div className="text-center mb-16">
            <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand mb-4 block">Why Us</span>
            <h2 className="text-4xl sm:text-5xl font-bold font-display text-text-primary tracking-[-1px]">Why Choose Us</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <ScrollReveal key={i} animation="scale-in" delay={i * 150} className="h-full">
                <div className="bg-white border border-border-light rounded-2xl p-10 text-center card-hover shadow-card h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent-light flex items-center justify-center">
                    <Icon size={30} className="text-brand" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-text-primary mb-3">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-bg-section py-28 px-4 text-center overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-brand/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-accent-light/40 blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollReveal animation="scale-in" duration={600}>
            <h2 className="text-4xl sm:text-5xl md:text-[52px] font-bold font-display text-text-primary mb-6 tracking-[-1.5px] leading-tight">Ready to Hit the Road?</h2>
            <p className="text-text-secondary mb-10 text-[17px] sm:text-[18px] max-w-lg mx-auto">Book your self-drive car now via WhatsApp and receive a VIP booking experience.</p>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-all duration-250 text-[16px] shadow-lg hover:scale-[1.02] btn-shine-parent"
            >
              <FaWhatsapp size={22} />
              Book on WhatsApp
              <span className="btn-shine" />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border-light relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-bold font-display">
                <span className="text-text-primary">Ovressa</span><span className="text-brand">cars</span>
              </h3>
              <p className="text-sm text-text-secondary mt-3 leading-relaxed">Premium self-drive car rentals. Drive on your own terms.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-5">Quick Links</h4>
              <div className="space-y-3 text-sm text-text-secondary">
                <Link to="/" className="block hover:text-brand transition-colors">Home</Link>
                <Link to="/cars" className="block hover:text-brand transition-colors">Cars</Link>
                <Link to="/login" className="block hover:text-brand transition-colors">Login</Link>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-5">Contact</h4>
              <div className="space-y-3 text-sm text-text-secondary">
                <p>WhatsApp: {whatsapp}</p>
                <p>{city}</p>
                <p>contact@ovressacars.com</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border-light text-center text-sm text-text-muted">
            &copy; 2024 Ovressacars. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
