'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { clientsAPI, authAPI } from '@/lib/api'

export default function AdminClientsPage() {
    const [clients, setClients] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [newClient, setNewClient] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        phone: ''
    })

    useEffect(() => {
        loadClients()
    }, [])

    const loadClients = async () => {
        try {
            const data = await clientsAPI.getAll()
            setClients(data)
        } catch (error) {
            console.error('Error loading clients:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateClient = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await authAPI.registerClient(newClient)
            setShowModal(false)
            setNewClient({ name: '', email: '', password: '', company: '', phone: '' })
            loadClients()
        } catch (error: any) {
            console.error('Error creating client:', error)
            alert(error.message || 'Failed to create client')
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        try {
            if (currentStatus === 'active') {
                await clientsAPI.deactivate(id)
            } else {
                await clientsAPI.activate(id)
            }
            loadClients()
        } catch (error) {
            console.error('Error updating client status:', error)
        }
    }

    const filteredClients = clients.filter(client => {
        const matchesStatus = filterStatus === 'all' || client.status === filterStatus
        const matchesSearch = !searchQuery ||
            client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.company?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    return (
        <AdminLayout
            title="Clients"
            description="Manage your client accounts"
            actions={
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Client
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
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'active', 'inactive'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === status
                                    ? 'bg-[#EFA130] text-black'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clients Table */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading clients...</div>
            ) : filteredClients.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No clients found</h3>
                    <p className="text-gray-500 mb-6">Add your first client to get started</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                    >
                        Add Client
                    </button>
                </div>
            ) : (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Client</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm hidden md:table-cell">Company</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm hidden lg:table-cell">Phone</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                                    <th className="text-left p-4 text-gray-400 font-medium text-sm hidden sm:table-cell">Joined</th>
                                    <th className="text-right p-4 text-gray-400 font-medium text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map((client) => (
                                    <tr key={client._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#EFA130] to-[#d88f20] rounded-full flex items-center justify-center text-black font-bold">
                                                    {client.name?.charAt(0) || 'C'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{client.name}</p>
                                                    <p className="text-gray-500 text-sm">{client.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 hidden md:table-cell">{client.company || '-'}</td>
                                        <td className="p-4 text-gray-400 hidden lg:table-cell">{client.phone || '-'}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${client.status === 'active'
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm hidden sm:table-cell">
                                            {new Date(client.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(client._id, client.status)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${client.status === 'active'
                                                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                        }`}
                                                >
                                                    {client.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* New Client Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Register New Client</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateClient} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={newClient.name}
                                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={newClient.email}
                                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    placeholder="client@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                                <input
                                    type="password"
                                    value={newClient.password}
                                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                                    <input
                                        type="text"
                                        value={newClient.company}
                                        onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                        placeholder="Company Inc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={newClient.phone}
                                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
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
                                    Create Client
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
