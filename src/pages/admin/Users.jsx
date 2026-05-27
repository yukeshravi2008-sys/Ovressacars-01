import { useState, useEffect } from 'react'
import { MdSearch, MdPerson, MdEmail, MdPhone, MdBlock, MdCheckCircle, MdVisibility, MdClose } from 'react-icons/md'
import { getAllUsers, toggleUserBlock } from '../../firebase/userService'
import Sidebar from '../../components/Sidebar'
import toast from 'react-hot-toast'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleBlockToggle = async (user) => {
    try {
      await toggleUserBlock(user.uid || user.id, user.blocked)
      setUsers((prev) =>
        prev.map((u) =>
          (u.uid === user.uid || u.id === user.id) ? { ...u, blocked: !u.blocked } : u
        )
      )
      toast.success(`User ${user.blocked ? 'unblocked' : 'blocked'} successfully`)
      if (selectedUser && (selectedUser.uid === user.uid || selectedUser.id === user.id)) {
        setSelectedUser((prev) => ({ ...prev, blocked: !prev.blocked }))
      }
    } catch {
      toast.error('Failed to update user')
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const filtered = users.filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    )
  })

  return (
    <div className="flex min-h-screen bg-bg-section">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary font-display">Users</h1>
          <p className="text-sm text-text-muted mt-1 font-medium">{users.length} registered users</p>
        </div>

        <div className="relative max-w-xs mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FAFAF7] border border-[#ECECEC] w-9 h-9 rounded-full z-10 flex items-center justify-center">
            <MdSearch size={20} className="text-[#1F1F1F]" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-4 py-2.5 bg-white border border-border-light rounded-xl text-sm text-[#1F1F1F] placeholder:text-[#7A7A7A] focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white border border-border-light rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <MdPerson size={48} className="text-text-muted mx-auto mb-4" />
            <p className="text-text-muted font-medium">No users found.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-muted text-xs uppercase border-b border-border-light bg-white">
                    <th className="text-left p-4 font-semibold">User</th>
                    <th className="text-left p-4 font-semibold">Email</th>
                    <th className="text-left p-4 font-semibold">Phone</th>
                    <th className="text-left p-4 font-semibold">Role</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Joined</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.uid || user.id} className="border-b border-border-light last:border-0 hover:bg-bg-section/50 transition-colors bg-white">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent-light border border-brand/20 flex items-center justify-center">
                            <MdPerson size={16} className="text-brand" />
                          </div>
                          <span className="text-text-primary font-semibold">{user.name || 'Unnamed'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary">{user.email || 'N/A'}</td>
                      <td className="p-4 text-text-secondary">{user.phone || 'N/A'}</td>
                      <td className="p-4">
                        {user.role === 'admin' ? (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-accent-light text-brand border border-brand/20">Admin</span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-100 text-text-muted">User</span>
                        )}
                      </td>
                      <td className="p-4">
                        {user.blocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-danger">
                            <MdBlock size={12} /> Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-success">
                            <MdCheckCircle size={12} /> Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-text-secondary text-xs">{formatDate(user.createdAt)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 text-text-secondary hover:text-brand-gold transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <MdVisibility size={16} />
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleBlockToggle(user)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                                user.blocked
                                  ? 'bg-green-100 text-success hover:bg-green-200'
                                  : 'bg-red-100 text-danger hover:bg-red-200'
                              }`}
                            >
                              {user.blocked ? 'Unblock' : 'Block'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {filtered.map((user) => (
                <div key={user.uid || user.id} className="bg-white border border-border-light rounded-xl p-4 shadow-card">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent-light border border-brand/20 flex items-center justify-center shrink-0">
                      <MdPerson size={20} className="text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary font-bold truncate">{user.name || 'Unnamed'}</h3>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${
                      user.blocked
                        ? 'bg-red-100 text-danger'
                        : 'bg-green-100 text-success'
                    }`}>
                      {user.blocked ? <MdBlock size={12} /> : <MdCheckCircle size={12} />}
                      {user.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="flex-1 px-3 py-2 text-xs font-bold text-brand bg-accent-light rounded-xl hover:bg-accent-light/80 transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleBlockToggle(user)}
                        className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                          user.blocked
                            ? 'bg-green-100 text-success'
                            : 'bg-red-100 text-danger'
                        }`}
                      >
                        {user.blocked ? 'Unblock' : 'Block'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white border border-border-light rounded-2xl p-6 max-w-md w-full animate-fade-in shadow-lg-custom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary font-display">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                <MdClose size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent-light border border-brand/20 flex items-center justify-center mb-3">
                <MdPerson size={32} className="text-brand" />
              </div>
              <h4 className="text-lg font-bold text-text-primary">{selectedUser.name || 'Unnamed'}</h4>
              <span className={`mt-1 px-3 py-0.5 text-xs font-bold rounded-full ${
                selectedUser.role === 'admin' ? 'bg-accent-light text-brand border border-brand/20' : 'bg-gray-100 text-text-muted'
              }`}>
                {selectedUser.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-bg-section rounded-xl border border-border-light/50">
                <MdEmail size={18} className="text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted font-medium">Email</p>
                  <p className="text-sm text-text-primary font-semibold">{selectedUser.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-section rounded-xl border border-border-light/50">
                <MdPhone size={18} className="text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted font-medium">Phone</p>
                  <p className="text-sm text-text-primary font-semibold">{selectedUser.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-section rounded-xl border border-border-light/50">
                <MdBlock size={18} className="text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted font-medium">Status</p>
                  <p className="text-sm text-text-primary font-semibold">{selectedUser.blocked ? 'Blocked' : 'Active'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-section rounded-xl border border-border-light/50">
                <MdPerson size={18} className="text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted font-medium">Joined</p>
                  <p className="text-sm text-text-primary font-semibold">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
            </div>

            {selectedUser.role !== 'admin' && (
              <button
                onClick={() => { handleBlockToggle(selectedUser); setSelectedUser(null) }}
                className={`w-full mt-6 py-2.5 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
                  selectedUser.blocked
                    ? 'bg-green-100 text-success hover:bg-green-200'
                    : 'bg-red-100 text-danger hover:bg-red-200'
                }`}
              >
                {selectedUser.blocked ? 'Unblock User' : 'Block User'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
