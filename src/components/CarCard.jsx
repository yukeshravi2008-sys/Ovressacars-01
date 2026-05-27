import { useState } from 'react'
import { BsFuelPump, BsPeopleFill, BsGear } from 'react-icons/bs'
import { useCarImage } from '../utils/carImage'
import BookingModal from './BookingModal'

export default function CarCard({ car, showBookButton = true, dark = false }) {
  const [showBooking, setShowBooking] = useState(false)
  const { src, handleError, imgRef } = useCarImage(car)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(Number(price) || 0)
  }

  return (
    <>
      <div
        className={`rounded-2xl overflow-hidden flex flex-col border ${
          dark
            ? 'bg-[#1A1A1A] border-[#2A2A2A]'
            : 'bg-white border-[#E8E8E0] shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
        } ${!car.available ? 'opacity-70' : ''}`}
      >
        <div className="h-[160px] p-4 flex items-center justify-center bg-transparent">
          <img
            ref={imgRef}
            src={src}
            alt={car.name || car.type}
            loading="lazy"
            className="w-full h-full object-contain"
            onError={handleError}
          />
        </div>
        <div className="h-px bg-[#E8E8E0] mx-4" />
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`text-base font-extrabold font-display truncate ${
                dark ? 'text-white' : 'text-[#1A1A1A]'
              }`}
            >
              {car.name}
            </h3>
            <span className="text-lg font-black text-[#C9A84C] shrink-0">
              ₹{formatPrice(car.pricePerDay)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#ABABAB]">
            <span className="flex items-center gap-1">
              <BsFuelPump size={12} />
              {car.fuelType || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <BsPeopleFill size={12} />
              {car.seats || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <BsGear size={12} />
              {car.transmission || 'N/A'}
            </span>
          </div>

          {showBookButton && (
            <button
              onClick={() => setShowBooking(true)}
              className="w-full py-3.5 text-sm font-extrabold text-white bg-[#C9A84C] rounded-xl hover:bg-[#A8872D] transition-all duration-200 cursor-pointer"
            >
              Book Now
            </button>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        car={car}
      />
    </>
  )
}
