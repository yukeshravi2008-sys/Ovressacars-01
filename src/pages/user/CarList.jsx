import { useState, useEffect } from 'react'
import { MdDirectionsCar, MdSearch } from 'react-icons/md'
import { getAllCars } from '../../firebase/carService'
import Navbar from '../../components/Navbar'
import CarCard from '../../components/CarCard'
import SkeletonCard from '../../components/SkeletonCard'
import ScrollReveal from '../../components/ScrollReveal'

const carTypes = ['All', 'Hatchback', 'Sedan', 'SUV', 'Luxury']
const sortOptions = ['Default', 'Price: Low to High', 'Price: High to Low', 'Name: A-Z', 'Name: Z-A']

export default function CarList() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [sortBy, setSortBy] = useState('Default')
  const [showSort, setShowSort] = useState(false)

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

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Header */}
      <section className="bg-bg-section/50 py-20 border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="slide-up">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-[12px] font-semibold uppercase tracking-[3px] text-brand mb-3 block">Explore Our Fleet</span>
              <h1 className="text-4xl sm:text-5xl font-bold font-display text-text-primary mb-4 tracking-[-1px]">Our Cars</h1>
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
              <div className="relative flex-1 max-w-md shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FAFAF7] border border-[#ECECEC] w-9 h-9 rounded-full z-10 flex items-center justify-center">
                  <MdSearch size={20} className="text-[#1F1F1F]" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cars by name, brand, or type..."
                  className="w-full pl-14 pr-4 py-3 bg-white border border-border-light rounded-xl text-sm text-[#1F1F1F] placeholder:text-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="px-5 py-3 bg-white border border-border-light rounded-xl text-sm font-medium text-text-secondary hover:border-brand hover:text-brand transition-all flex items-center gap-2 justify-center sm:justify-start min-w-[180px] cursor-pointer"
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
                              ? 'text-brand font-semibold bg-accent-light'
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

            <div className="flex flex-wrap gap-2">
              {carTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-5 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer ${
                    activeTab === type
                      ? 'bg-[#1F1F1F] text-white shadow-sm'
                      : 'bg-bg-primary text-text-secondary border border-border-light hover:border-brand hover:text-brand'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Car Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-danger mb-4 text-lg">Failed to load cars: {error}</p>
            <button
              onClick={fetchCars}
              className="px-6 py-2.5 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-colors cursor-pointer"
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
              className="mt-6 px-6 py-2.5 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((car, idx) => (
              <ScrollReveal key={car.id} animation="slide-up" delay={idx * 80}>
                <CarCard car={car} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
