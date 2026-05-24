import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import SmoothScroll from './components/SmoothScroll'
import ScrollProgressBar from './components/ScrollProgressBar'

import Home from './pages/user/Home'
import CarList from './pages/user/CarList'
import CarDetail from './pages/user/CarDetail'
import Login from './pages/user/Login'
import Register from './pages/user/Register'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import ManageCars from './pages/admin/ManageCars'
import AddCar from './pages/admin/AddCar'
import EditCar from './pages/admin/EditCar'
import Bookings from './pages/admin/Bookings'
import Users from './pages/admin/Users'
import Settings from './pages/admin/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SmoothScroll>
          <ScrollProgressBar />
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'premium-toast',
              duration: 3000,
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cars"
              element={
                <ProtectedRoute adminOnly>
                  <ManageCars />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cars/add"
              element={
                <ProtectedRoute adminOnly>
                  <AddCar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cars/edit/:id"
              element={
                <ProtectedRoute adminOnly>
                  <EditCar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute adminOnly>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute adminOnly>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SmoothScroll>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
