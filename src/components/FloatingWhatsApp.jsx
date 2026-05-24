import { FaWhatsapp } from 'react-icons/fa'

export default function FloatingWhatsApp() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-whatsapp text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 hover:shadow-xl transition-all duration-300 animate-float"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={26} />
    </a>
  )
}
