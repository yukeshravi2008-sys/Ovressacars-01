import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-bg-primary text-center">
      <h1 className="text-8xl md:text-9xl font-black text-brand-gold mb-4">404</h1>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Page Not Found</h2>
      <p className="text-text-secondary mb-8 max-w-md">
        The page you're looking for doesn't exist.
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-brand-gold text-white font-extrabold rounded-xl hover:bg-brand-gold-dark transition-colors shadow-accent-custom"
        >
          Go Back Home
        </button>
        <button
          onClick={() => navigate('/cars')}
          className="px-6 py-3 bg-white text-text-primary font-bold border border-border-light rounded-xl hover:border-brand-gold transition-colors"
        >
          Browse Cars
        </button>
      </div>
    </div>
  )
}
