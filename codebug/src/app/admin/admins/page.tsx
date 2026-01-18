'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { authAPI } from '@/lib/api'

export default function AdminUsersPage() {
    const [admins, setAdmins] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterRole, setFilterRole] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin'
    })
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    useEffect(() => {
        loadAdmins()
        loadCurrentUser()
    }, [])

    const loadCurrentUser = async () => {
        try {
            const user = await authAPI.checkAuth()
            setCurrentUserId(user.id)
        } catch (error) {
            console.error('Error loading current user:', error)
        }
    }

    const loadAdmins = async () => {
        try {
            const data = await authAPI.getAllAdmins()
            setAdmins(data)
        } catch (error) {
            console.error('Error loading admins:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await authAPI.registerAdmin(newAdmin.name, newAdmin.email, newAdmin.password, newAdmin.role)
            setShowModal(false)
            setNewAdmin({ name: '', email: '', password: '', role: 'admin' })
            loadAdmins()
        } catch (error: any) {
            console.error('Error creating admin:', error)
            alert(error.message || 'Failed to create admin')
        }
    }

    const handleDeleteAdmin = async (id: string) => {
        if (id === currentUserId) {
            alert('You cannot delete your own account')
            return
        }
        if (!confirm('Are you sure you want to delete this admin?')) return
        try {
            await authAPI.deleteAdmin(id)
            loadAdmins()
        } catch (error: any) {
            console.error('Error deleting admin:', error)
            alert(error.message || 'Failed to delete admin')
        }
    }

    const filteredAdmins = admins.filter(admin => {
        const matchesRole = filterRole === 'all' || admin.role === filterRole
        const matchesSearch = !searchQuery ||
            admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesRole && matchesSearch
    })

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/20 text-red-400'
            case 'editor': return 'bg-blue-500/20 text-blue-400'
            case 'viewer': return 'bg-gray-500/20 text-gray-400'
            default: return 'bg-gray-500/20 text-gray-400'
        }
    }

    return (
        <AdminLayout
            title="Admin Users"
            description="Manage admin accounts and permissions"
            actions={
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Admin
                </button>
            }
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search admins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'admin', 'editor', 'viewer'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterRole === role
                                ? 'bg-[#EFA130] text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Admins Table */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading admins...</div>
            ) : filteredAdmins.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No admins found</h3>
                    <p className="text-gray-500 mb-6">Add your first admin user to get started</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                    >
                        Add Admin
                    </button>
                </div>
            ) : (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Admin</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Role</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm hidden sm:table-cell">Joined</th>
                                    <th className="text-right p-4 text-gray-400 font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {admin.name?.charAt(0) || 'A'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {admin.name}
                                                        {admin._id === currentUserId && (
                                                            <span className="ml-2 text-xs text-[#EFA130]">(You)</span>
                                                        )}
                                                    </p>
                                                    <p className="text-gray-500 text-sm">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(admin.role)}`}>
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm hidden sm:table-cell">
                                            {new Date(admin.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {admin._id !== currentUserId && (
                                                    <button
                                                        onClick={() => handleDeleteAdmin(admin._id)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* New Admin Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Add New Admin</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    placeholder="admin@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                                <input
                                    type="password"
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <select
                                    value={newAdmin.role}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                >
                                    <option value="admin" className="bg-[#1a1a1a]">Admin (Full Access)</option>
                                    <option value="editor" className="bg-[#1a1a1a]">Editor (Create/Edit)</option>
                                    <option value="viewer" className="bg-[#1a1a1a]">Viewer (Read Only)</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                                >
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
