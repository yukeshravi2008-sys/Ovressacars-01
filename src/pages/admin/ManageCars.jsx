import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdAdd, MdEdit, MdDelete, MdDirectionsCar, MdSearch } from 'react-icons/md'
import { getAllCars, deleteCar, toggleCarAvailability, deleteCarPhoto } from '../../firebase/carService'
import Sidebar from '../../components/Sidebar'
import ConfirmModal from '../../components/ConfirmModal'
import toast from 'react-hot-toast'

export default function ManageCars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, car: null })
  const [photoDeleteModal, setPhotoDeleteModal] = useState({ isOpen: false, car: null })

  const navigate = useNavigate()

  const fetchCars = async () => {
    setLoading(true)
    try {
      const data = await getAllCars()
      setCars(data)
    } catch {
      toast.error('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCars() }, [])

  const formatPrice = (p) => new Intl.NumberFormat('en-IN').format(Number(p) || 0)

  const filtered = cars.filter((car) => {
    if (search && !car.name?.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter && car.type !== typeFilter) return false
    if (statusFilter === 'available' && !car.available) return false
    if (statusFilter === 'unavailable' && car.available) return false
    return true
  })

  const types = [...new Set(cars.map((c) => c.type).filter(Boolean))]
  const uniqueTypes = ['', ...types]

  const handleDelete = async () => {
    if (!deleteModal.car) return
    const car = deleteModal.car
    try {
      await deleteCar(car.id, car.photoURL)
      setCars((prev) => prev.filter((c) => c.id !== car.id))
      toast.success('Car deleted successfully')
    } catch {
      toast.error('Failed to delete car')
    }
    setDeleteModal({ isOpen: false, car: null })
  }

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

  const handleDeletePhoto = async () => {
    if (!photoDeleteModal.car) return
    const car = photoDeleteModal.car
    try {
      await deleteCarPhoto(car.id, car.photoURL)
      setCars((prev) =>
        prev.map((c) => (c.id === car.id ? { ...c, photoURL: '' } : c))
      )
      toast.success('Photo deleted successfully')
    } catch {
      toast.error('Failed to delete photo')
    }
    setPhotoDeleteModal({ isOpen: false, car: null })
  }

  return (
    <div className="flex min-h-screen bg-bg-section">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-display">Manage Cars</h1>
            <p className="text-sm text-text-muted mt-1 font-medium">{cars.length} cars in fleet</p>
          </div>
          <button
            onClick={() => navigate('/admin/cars/add')}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-gold-dark transition-all duration-250 text-sm cursor-pointer"
          >
            <MdAdd size={18} />
            Add New Car
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-xs shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FAFAF7] border border-[#ECECEC] w-9 h-9 rounded-full z-10 flex items-center justify-center">
              <MdSearch size={20} className="text-[#1F1F1F]" />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-4 py-2.5 bg-white border border-border-light rounded-xl text-sm text-[#1F1F1F] placeholder:text-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-border-light rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          >
            <option value="">All Types</option>
            {uniqueTypes.filter(Boolean).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-border-light rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white border border-border-light rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <MdDirectionsCar size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted font-medium mb-4">No cars yet. Add your first car.</p>
            <button
              onClick={() => navigate('/admin/cars/add')}
              className="px-6 py-2.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-gold-dark transition-all duration-250 cursor-pointer"
            >
              Add First Car
            </button>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-muted text-xs uppercase border-b border-border-light bg-white">
                    <th className="text-left p-4 font-semibold">Photo</th>
                    <th className="text-left p-4 font-semibold">Car Name</th>
                    <th className="text-left p-4 font-semibold">Brand</th>
                    <th className="text-left p-4 font-semibold">Type</th>
                    <th className="text-left p-4 font-semibold">Price/Day</th>
                    <th className="text-left p-4 font-semibold">Availability</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((car) => (
                    <tr key={car.id} className="border-b border-border-light last:border-0 hover:bg-bg-section/50 transition-colors bg-white">
                      <td className="p-4">
                        <div className="relative group w-16 h-12 rounded-lg overflow-hidden bg-bg-section">
                          {car.photoURL ? (
                            <>
                              <img src={car.photoURL} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => setPhotoDeleteModal({ isOpen: true, car })}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                <MdDelete size={16} className="text-white" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MdDirectionsCar size={20} className="text-text-muted" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-text-primary font-semibold">{car.name}</td>
                      <td className="p-4 text-text-secondary">{car.brand || 'N/A'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 text-xs bg-accent-light text-brand font-bold rounded-full border border-brand/20">{car.type}</span>
                      </td>
                      <td className="p-4 text-brand font-bold">₹{formatPrice(car.pricePerDay)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggle(car)}
                          className={`px-3 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                            car.available
                              ? 'bg-green-100 text-success hover:bg-green-200'
                              : 'bg-red-100 text-danger hover:bg-red-200'
                          }`}
                        >
                          {car.available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                            className="px-3 py-1.5 text-xs font-bold text-brand bg-accent-light rounded-xl hover:bg-accent-light/80 transition-colors cursor-pointer"
                          >
                            <MdEdit size={14} className="inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, car })}
                            className="px-3 py-1.5 text-xs font-bold text-danger bg-red-100 rounded-xl hover:bg-red-200 transition-colors cursor-pointer"
                          >
                            <MdDelete size={14} className="inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {filtered.map((car) => (
                <div key={car.id} className="bg-white border border-border-light rounded-xl p-4 shadow-card">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-bg-section">
                      {car.photoURL ? (
                        <img src={car.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MdDirectionsCar size={20} className="text-text-muted" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary font-bold truncate">{car.name}</h3>
                      <p className="text-xs text-text-muted">{car.brand ? `${car.brand} · ${car.type}` : car.type}</p>
                      <p className="text-sm text-brand font-bold mt-1">₹{formatPrice(car.pricePerDay)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin/cars/edit/${car.id}`)}
                      className="flex-1 px-3 py-2 text-xs font-bold text-brand bg-accent-light rounded-xl hover:bg-accent-light/80 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggle(car)}
                      className={`flex-shrink-0 px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        car.available
                          ? 'bg-green-100 text-success'
                          : 'bg-red-100 text-danger'
                      }`}
                    >
                      {car.available ? 'Available' : 'Unavailable'}
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, car })}
                      className="flex-shrink-0 px-3 py-2 text-xs font-bold text-danger bg-red-100 rounded-xl hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      <MdDelete size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, car: null })}
        onConfirm={handleDelete}
        title="Delete Car"
        message={`Are you sure you want to delete "${deleteModal.car?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />

      <ConfirmModal
        isOpen={photoDeleteModal.isOpen}
        onClose={() => setPhotoDeleteModal({ isOpen: false, car: null })}
        onConfirm={handleDeletePhoto}
        title="Delete Photo"
        message={`Are you sure you want to delete the photo of "${photoDeleteModal.car?.name}"?`}
        confirmText="Delete Photo"
        confirmVariant="warning"
      />
    </div>
  )
}
