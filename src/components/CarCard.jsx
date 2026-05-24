import { BsFuelPump, BsPeopleFill, BsGear } from 'react-icons/bs'
import { useCarImage } from '../utils/carImage'

const WHATSAPP_NUMBER = '917845892808'

function openWhatsApp(carName) {
  const msg = `Hello Ovressacars, I want to book ${carName}`
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    '_blank'
  )
}

export default function CarCard({ car, showBookButton = true }) {
  const { src, handleError, imgRef } = useCarImage(car)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(Number(price) || 0)
  }

  return (
    <div
      onClick={() => openWhatsApp(car.name)}
      className={`cursor-pointer bg-white border border-border-light rounded-3xl overflow-hidden card-hover shadow-card group ${
        !car.available ? 'opacity-70' : ''
      }`}
    >
      <div className="relative h-[260px] overflow-hidden bg-bg-section">
        <img
          ref={imgRef}
          src={src}
          alt={car.name || car.type}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={handleError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        <span className="absolute top-4 left-4 px-3.5 py-1.5 text-xs font-bold bg-white/90 text-accent-dark rounded-full backdrop-blur-sm shadow-sm">
          {car.type || 'Standard'}
        </span>
        {car.available ? (
          <span className="absolute top-4 right-4 px-3.5 py-1.5 text-xs font-bold bg-brand/10 text-brand border border-brand/20 rounded-full">
            Available
          </span>
        ) : (
          <span className="absolute top-4 right-4 px-3.5 py-1.5 text-xs font-bold bg-red-100 text-danger rounded-full">
            Unavailable
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold font-display text-text-primary mb-4 truncate">{car.name}</h3>

        <div className="flex items-center gap-5 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <BsFuelPump size={13} className="text-brand" />
            {car.fuelType || 'N/A'}
          </span>
          <span className="flex items-center gap-1.5">
            <BsPeopleFill size={13} className="text-brand" />
            {car.seats || 'N/A'}
          </span>
          <span className="flex items-center gap-1.5">
            <BsGear size={13} className="text-brand" />
            {car.transmission || 'N/A'}
          </span>
        </div>
      </div>

      <div className="border-t border-border-light px-6 py-5 flex items-center justify-between">
        <div>
          <span className="text-[28px] font-black font-display text-brand tracking-tight">₹{formatPrice(car.pricePerDay)}</span>
          <span className="text-xs text-text-muted ml-1.5 font-medium">/ day</span>
        </div>
        {showBookButton && (
          <button
            onClick={(e) => { e.stopPropagation(); openWhatsApp(car.name) }}
            className="px-6 py-3 text-sm font-bold text-white bg-[#1F1F1F] rounded-xl hover:bg-brand transition-all duration-250 btn-shine-parent"
          >
            Book Now
            <span className="btn-shine" />
          </button>
        )}
      </div>
    </div>
  )
}
