import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdArrowBack, MdCloudUpload } from 'react-icons/md'
import { addCar } from '../../firebase/carService'
import Sidebar from '../../components/Sidebar'
import toast from 'react-hot-toast'

const defaultForm = {
  name: '',
  brand: '',
  type: 'Sedan',
  fuelType: 'Petrol',
  transmission: 'Manual',
  seats: 5,
  pricePerDay: '',
  kmLimit: '',
  pickupLocation: '',
  description: '',
  available: true,
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function AddCar() {
  const [form, setForm] = useState(defaultForm)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))
  const updateNum = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const handlePhoto = (file) => {
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, or WebP image')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 5MB limit')
      return
    }
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Car name is required'
    if (!form.pricePerDay || Number(form.pricePerDay) <= 0) errs.pricePerDay = 'Valid price is required'
    if (!form.seats || Number(form.seats) < 2 || Number(form.seats) > 9) errs.seats = 'Seats must be between 2 and 9'
    if (!form.pickupLocation.trim()) errs.pickupLocation = 'Pickup location is required'
    if (form.description.length > 500) errs.description = 'Description must be under 500 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      const firstErr = document.querySelector('[data-error]')
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSaving(true)
    setUploadProgress(0)

    try {
      const carData = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        type: form.type,
        fuelType: form.fuelType,
        transmission: form.transmission,
        seats: Number(form.seats),
        pricePerDay: Number(form.pricePerDay),
        kmLimit: form.kmLimit ? Number(form.kmLimit) : '',
        pickupLocation: form.pickupLocation.trim(),
        description: form.description.trim(),
      }

      const { usedLocalFallback } = await addCar(carData, photo, (pct) => setUploadProgress(pct))
      setUploadProgress(100)

      if (usedLocalFallback) {
        toast.success('Upload failed. Using local image storage.')
      }
      toast.success('Car added successfully!')
      navigate('/admin/cars')
    } catch {
      setUploadProgress(0)
      toast.error('Failed to add car. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-bg-section">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <button
          onClick={() => navigate('/admin/cars')}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand-gold mb-6 transition-colors cursor-pointer"
        >
          <MdArrowBack size={18} />
          Back to Manage Cars
        </button>

        <h1 className="text-2xl font-bold text-text-primary mb-8 font-display">Add New Car</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-light font-display">
                Basic Information
              </h2>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">
                Car Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                className={`w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all ${errors.name ? '!border-danger' : ''}`}
                placeholder="Fortuner"
              />
              {errors.name && <p data-error className="text-xs text-danger mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">Brand</label>
              <input
                type="text"
                value={form.brand}
                onChange={update('brand')}
                className="w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                placeholder="Toyota"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">
                Car Type <span className="text-danger">*</span>
              </label>
              <select value={form.type} onChange={update('type')} className="w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all">
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">Fuel Type</label>
              <select value={form.fuelType} onChange={update('fuelType')} className="w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all">
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">Transmission</label>
              <select value={form.transmission} onChange={update('transmission')} className="w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all">
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-light mt-4 font-display">
                Specifications
              </h2>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">
                Number of Seats <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={form.seats}
                onChange={updateNum('seats')}
                min="2"
                max="9"
                className={`w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all ${errors.seats ? '!border-danger' : ''}`}
              />
              {errors.seats && <p data-error className="text-xs text-danger mt-1">{errors.seats}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">
                Price Per Day (₹) <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={form.pricePerDay}
                onChange={updateNum('pricePerDay')}
                className={`w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all ${errors.pricePerDay ? '!border-danger' : ''}`}
                placeholder="2999"
              />
              {errors.pricePerDay && <p data-error className="text-xs text-danger mt-1">{errors.pricePerDay}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">KM Limit Per Day</label>
              <input
                type="number"
                value={form.kmLimit}
                onChange={updateNum('kmLimit')}
                className="w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                placeholder="300"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">
                Pickup Location <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.pickupLocation}
                onChange={update('pickupLocation')}
                className={`w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all ${errors.pickupLocation ? '!border-danger' : ''}`}
                placeholder="City or specific address"
              />
              {errors.pickupLocation && <p data-error className="text-xs text-danger mt-1">{errors.pickupLocation}</p>}
            </div>

            <div className="md:col-span-2">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-light mt-4 font-display">
                Description
              </h2>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary mb-1.5 font-medium">Short Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows="4"
                maxLength="500"
                className={`w-full px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all resize-none ${errors.description ? '!border-danger' : ''}`}
                placeholder="Describe the car features, condition, or any special notes..."
              />
              <p className="text-xs text-text-muted mt-1">{form.description.length}/500 characters</p>
              {errors.description && <p data-error className="text-xs text-danger mt-1">{errors.description}</p>}
            </div>

            <div className="md:col-span-2">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-light mt-4 font-display">
                Photo Upload
              </h2>
            </div>

            <div className="md:col-span-2">
              {photoPreview ? (
                <div>
                  <div className="aspect-video rounded-xl overflow-hidden bg-bg-section mb-3 border border-border-light">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-secondary">
                      {photo?.name} ({(photo?.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                    <button
                      type="button"
                      onClick={() => { setPhoto(null); setPhotoPreview(null) }}
                      className="text-xs text-brand hover:underline font-semibold cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-border-light bg-white cursor-pointer hover:border-brand-gold transition-colors">
                  <MdCloudUpload size={40} className="text-text-muted mb-2" />
                  <p className="text-sm text-text-secondary font-medium">Drag & drop car photo here or click to browse</p>
                  <p className="text-xs text-text-muted mt-1">JPEG, PNG, WebP • max 5MB</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handlePhoto(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="md:col-span-2">
              <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-border-light mt-4 font-display">
                Availability
              </h2>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, available: !p.available }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    form.available ? 'bg-success' : 'bg-bg-section'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.available ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                  <span className={`w-2 h-2 rounded-full ${form.available ? 'bg-success' : 'bg-danger'}`} />
                  {form.available ? 'Available for booking' : 'Not available'}
                </span>
              </label>
            </div>
          </div>

          {saving && uploadProgress > 0 && (
            <div className="mb-6">
              <div className="h-2 bg-bg-section rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-text-muted mt-1 font-medium">Uploading... {uploadProgress}%</p>
            </div>
          )}

          <div className="flex items-center gap-4 pb-12">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-gold-dark transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer text-[15px] shadow-lg"
            >
              {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Saving...' : 'Save Car'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/cars')}
              disabled={saving}
              className="px-8 py-3 bg-white text-text-secondary font-bold border border-border-light rounded-xl hover:border-brand-gold hover:text-brand-gold transition-all duration-250 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
