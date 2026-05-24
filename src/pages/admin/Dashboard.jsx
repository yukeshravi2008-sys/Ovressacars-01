import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdDirectionsCar, MdPeople, MdBookOnline, MdCurrencyRupee, MdEdit, MdToggleOn, MdToggleOff } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { getAllCars, toggleCarAvailability } from '../../firebase/carService'
import { getAllBookings } from '../../firebase/bookingService'
import { getAllUsers } from '../../firebase/userService'
import Sidebar from '../../components/Sidebar'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [cars, setCars] = useState([])
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const [carsData, bookingsData, usersData] = await Promise.all([
          getAllCars(),
          getAllBookings(),
          getAllUsers(),
        ])
        setCars(carsData)
        setBookings(bookingsData)
        setUsers(usersData)
      } catch {
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const totalCars = cars.length
  const totalUsers = users.length
  const totalBookings = bookings.length
  const revenue = bookings
    .filter((b) => b.status === 'completed' || b.status === 'approved')
    .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0)
  const recentCars = cars.slice(0, 5)
  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(Number(p) || 0)

  const handleToggle = async (car) => {
    try {
      await toggleCarAvailability(car.id, car.available)
      setCars((prev) =>
        prev.map((c) => (c.id === car.id ? { ...c, available: !c.available } : c))
      )
      toast.success(`Car marked as ${car.available ? 'Unavailable' : 'Available'}`)
    } catch {
      toast.error('Failed to toggle availability')
    }
  }

  const stats = [
    { icon: MdDirectionsCar, label: 'Total Cars', value: totalCars, color: 'text-brand' },
    { icon: MdPeople, label: 'Total Users', value: totalUsers, color: 'text-blue-500' },
    { icon: MdBookOnline, label: 'Total Bookings', value: totalBookings, color: 'text-purple-500' },
    { icon: MdCurrencyRupee, label: 'Revenue', value: `₹${formatPrice(revenue)}`, color: 'text-success' },
  ]

  return (
    <div className="flex min-h-screen bg-bg-section">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary font-display">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1 font-medium">Welcome back, {currentUser?.email || 'Admin'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-white border border-border-light rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-bg-section flex items-center justify-center border border-border-light/50">
                    <Icon size={22} className={stat.color} />
                  </div>
                  {loading ? (
                    <div className="h-8 w-16 bg-bg-section rounded-lg animate-pulse" />
                  ) : (
                    <span className="text-3xl font-bold text-text-primary">{stat.value}</span>
                  )}
                </div>
                <p className="text-sm text-text-muted font-medium">{stat.label}</p>
              </div>
            )
          })}
        </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => navigate('/admin/cars/add')}
              className="px-5 py-2.5 bg-[#1F1F1F] text-white font-bold rounded-xl hover:bg-brand transition-all duration-250 text-sm cursor-pointer"
            >
              Add New Car
            </button>
            <button
              onClick={() => navigate('/admin/cars')}
              className="px-5 py-2.5 bg-white text-text-primary font-semibold border border-border-light rounded-xl hover:border-brand hover:text-brand transition-all duration-250 text-sm cursor-pointer"
            >
              Manage Cars
            </button>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="px-5 py-2.5 bg-white text-text-primary font-semibold border border-border-light rounded-xl hover:border-brand hover:text-brand transition-all duration-250 text-sm cursor-pointer"
            >
              View Bookings
            </button>
          </div>

        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-card">
          <div className="p-5 border-b border-border-light">
            <h2 className="text-lg font-bold text-text-primary font-display">Recent Cars Added</h2>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-bg-section rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentCars.length === 0 ? (
            <div className="p-10 text-center text-text-muted font-medium">No cars added yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-muted text-xs uppercase border-b border-border-light bg-bg-section">
                    <th className="text-left p-4 font-semibold">Photo</th>
                    <th className="text-left p-4 font-semibold">Name</th>
                    <th className="text-left p-4 font-semibold">Type</th>
                    <th className="text-left p-4 font-semibold">Price/Day</th>
                    <th className="text-left p-4 font-semibold">Availability</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCars.map((car) => (
                    <tr key={car.id} className="border-b border-border-light last:border-0 hover:bg-bg-section/50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-bg-section">
                          {car.photoURL ? (
                            <img src={car.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MdDirectionsCar size={16} className="text-text-muted" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-text-primary font-semibold">{car.name}</td>
                      <td className="p-4 text-text-secondary">{car.type || 'N/A'}</td>
                      <td className="p-4 text-brand font-bold">₹{formatPrice(car.pricePerDay)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            car.available
                              ? 'bg-green-100 text-success'
                              : 'bg-red-100 text-danger'
                          }`}
                        >
                          {car.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                            className="p-2 bg-accent-light text-brand rounded-xl hover:bg-accent-light/80 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggle(car)}
                            className="p-2 text-text-secondary hover:text-brand transition-colors cursor-pointer"
                            title="Toggle availability"
                          >
                            {car.available ? <MdToggleOn size={18} /> : <MdToggleOff size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {cars.length > 5 && (
            <div className="p-4 border-t border-border-light text-center">
              <Link
                to="/admin/cars"
                className="text-sm text-brand hover:underline font-semibold"
              >
                View All Cars
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
