import { FaWhatsapp } from 'react-icons/fa'

export default function FloatingWhatsApp() {
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

  return (
    <a
      href={`https://wa.me/${whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.30)] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(37,211,102,0.40)] transition-all duration-300 animate-whatsapp-pulse"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={26} />
    </a>
  )
}
