import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />
  }

  if (adminOnly && userRole !== 'admin') {
    toast.error('Access denied. Admins only.')
    return <Navigate to="/" replace />
  }

  return children
}
