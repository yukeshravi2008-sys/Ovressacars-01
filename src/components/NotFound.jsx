import { Link } from 'react-router-dom'
import { MdErrorOutline } from 'react-icons/md'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent-light flex items-center justify-center">
          <MdErrorOutline size={36} className="text-brand" />
        </div>
        <h1 className="text-6xl font-black font-display text-text-primary mb-2">404</h1>
        <p className="text-lg text-text-secondary mb-8">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="px-8 py-3.5 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-colors inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
