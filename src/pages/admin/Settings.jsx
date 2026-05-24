import { MdInfo, MdSecurity, MdBusiness } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'

export default function Settings() {
  const { currentUser } = useAuth()

  const settings = [
    {
      section: 'Business Information',
      icon: MdBusiness,
      items: [
        { label: 'Business Name', value: import.meta.env.VITE_BUSINESS_NAME || 'Ovressacars' },
        { label: 'City', value: import.meta.env.VITE_CITY || 'Not set' },
        { label: 'WhatsApp Number', value: import.meta.env.VITE_WHATSAPP_NUMBER || 'Not set' },
      ],
    },
    {
      section: 'Admin Account',
      icon: MdSecurity,
      items: [
        { label: 'Email', value: currentUser?.email || 'N/A' },
        { label: 'User ID', value: currentUser?.uid || 'N/A' },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen bg-bg-section">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary font-display">Settings</h1>
          <p className="text-sm text-text-muted mt-1 font-medium">Application configuration</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {settings.map((group, i) => {
            const GroupIcon = group.icon
            return (
              <div key={i} className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-card">
                <div className="p-5 border-b border-border-light flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center border border-border-light/50">
                    <GroupIcon size={20} className="text-brand" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary font-display">{group.section}</h2>
                </div>
                <div className="divide-y divide-border-light">
                  {group.items.map((item, j) => (
                    <div key={j} className="px-5 py-4 flex items-center justify-between">
                      <span className="text-sm text-text-secondary font-medium">{item.label}</span>
                      <span className="text-sm text-text-primary font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="bg-white border border-border-light rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center border border-border-light/50">
                <MdInfo size={20} className="text-brand" />
              </div>
              <h2 className="text-lg font-bold text-text-primary font-display">About</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              Ovressacars Admin Portal v1.0. Manage your car fleet, bookings, and users from one place.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
