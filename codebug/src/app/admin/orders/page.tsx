'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { ordersAPI, clientsAPI } from '@/lib/api'

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [clients, setClients] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [newMilestone, setNewMilestone] = useState({ title: '', description: '', dueDate: '' })
    const [newOrder, setNewOrder] = useState({
        title: '',
        description: '',
        client: '',
        category: 'web',
        priority: 'medium',
        budget: '',
        deadline: ''
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [ordersData, clientsData] = await Promise.all([
                ordersAPI.getAll(),
                clientsAPI.getAll()
            ])
            setOrders(ordersData)
            setClients(clientsData)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await ordersAPI.create({
                ...newOrder,
                budget: newOrder.budget ? Number(newOrder.budget) : undefined
            })
            setShowModal(false)
            setNewOrder({ title: '', description: '', client: '', category: 'web', priority: 'medium', budget: '', deadline: '' })
            loadData()
        } catch (error: any) {
            console.error('Error creating order:', error)
            alert(error.message || 'Failed to create order')
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await ordersAPI.updateStatus(id, status)
            loadData()
            if (selectedOrder?._id === id) {
                setSelectedOrder({ ...selectedOrder, status })
            }
        } catch (error) {
            console.error('Error updating order:', error)
        }
    }

    const handleUpdateProgress = async (id: string, progress: number) => {
        try {
            await ordersAPI.updateProgress(id, progress)
            if (selectedOrder?._id === id) {
                setSelectedOrder({ ...selectedOrder, progress })
            }
            loadData()
        } catch (error) {
            console.error('Error updating progress:', error)
        }
    }

    const handleAddMilestone = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedOrder) return
        try {
            await ordersAPI.addMilestone(selectedOrder._id, newMilestone)
            setNewMilestone({ title: '', description: '', dueDate: '' })
            // Reload order details
            const updatedOrder = await ordersAPI.getById(selectedOrder._id)
            setSelectedOrder(updatedOrder)
            loadData()
        } catch (error) {
            console.error('Error adding milestone:', error)
        }
    }

    const handleUpdateMilestone = async (milestoneId: string, completed: boolean) => {
        if (!selectedOrder) return
        try {
            await ordersAPI.updateMilestone(selectedOrder._id, milestoneId, { completed })
            // Reload order details
            const updatedOrder = await ordersAPI.getById(selectedOrder._id)
            setSelectedOrder(updatedOrder)
            loadData()
        } catch (error) {
            console.error('Error updating milestone:', error)
        }
    }

    const openOrderDetails = async (order: any) => {
        try {
            const fullOrder = await ordersAPI.getById(order._id)
            setSelectedOrder(fullOrder)
            setShowDetailModal(true)
        } catch (error) {
            console.error('Error loading order details:', error)
        }
    }

    const filteredOrders = orders.filter(order =>
        filterStatus === 'all' || order.status === filterStatus
    )

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-500/20 text-yellow-400',
        'in-progress': 'bg-blue-500/20 text-blue-400',
        review: 'bg-purple-500/20 text-purple-400',
        completed: 'bg-emerald-500/20 text-emerald-400',
        cancelled: 'bg-red-500/20 text-red-400'
    }

    return (
        <AdminLayout
            title="Orders"
            description="Manage client project orders"
            actions={
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Order
                </button>
            }
        >
            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'pending', 'in-progress', 'review', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filterStatus === status
                            ? 'bg-[#EFA130] text-black'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Orders Grid */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-6">Create a new order for a client</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                    >
                        Create Order
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#EFA130]/30 transition-all cursor-pointer"
                            onClick={() => openOrderDetails(order)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{order.title}</h3>
                                    <p className="text-gray-500 text-sm">{order.client?.name || 'Unknown Client'} • {order.client?.company}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                                    {order.status?.replace('-', ' ')}
                                </span>
                            </div>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{order.description}</p>

                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-400 text-xs">Progress</span>
                                    <span className="text-white text-xs font-medium">{order.progress || 0}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#EFA130] to-[#d88f20] rounded-full"
                                        style={{ width: `${order.progress || 0}%` }}
                                    />
                                </div>
                            </div>

                            {/* Milestones Preview */}
                            {order.milestones?.length > 0 && (
                                <div className="text-xs text-gray-500 mb-4">
                                    {order.milestones.filter((m: any) => m.completed).length}/{order.milestones.length} milestones completed
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="capitalize">{order.category}</span>
                                <span>•</span>
                                <span className="capitalize">{order.priority} priority</span>
                                {order.deadline && (
                                    <>
                                        <span>•</span>
                                        <span>Due: {new Date(order.deadline).toLocaleDateString()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)} />
                    <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#1a1a1a] z-10">
                            <div>
                                <h2 className="text-xl font-bold text-white">{selectedOrder.title}</h2>
                                <p className="text-gray-500 text-sm">{selectedOrder.client?.name} • {selectedOrder.client?.company}</p>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status & Progress */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    >
                                        <option value="pending" className="bg-[#1a1a1a]">Pending</option>
                                        <option value="in-progress" className="bg-[#1a1a1a]">In Progress</option>
                                        <option value="review" className="bg-[#1a1a1a]">Review</option>
                                        <option value="completed" className="bg-[#1a1a1a]">Completed</option>
                                        <option value="cancelled" className="bg-[#1a1a1a]">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Progress: {selectedOrder.progress || 0}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={selectedOrder.progress || 0}
                                        onChange={(e) => handleUpdateProgress(selectedOrder._id, parseInt(e.target.value))}
                                        className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#EFA130]"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                <p className="text-gray-300">{selectedOrder.description}</p>
                            </div>

                            {/* Milestones */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-3">Milestones</label>
                                <div className="space-y-3">
                                    {selectedOrder.milestones?.map((milestone: any, index: number) => (
                                        <div
                                            key={milestone._id || index}
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${milestone.completed
                                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                                    : 'bg-white/5 border-white/10'
                                                }`}
                                        >
                                            <button
                                                onClick={() => handleUpdateMilestone(milestone._id, !milestone.completed)}
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${milestone.completed
                                                        ? 'bg-emerald-500 border-emerald-500'
                                                        : 'border-gray-500 hover:border-[#EFA130]'
                                                    }`}
                                            >
                                                {milestone.completed && (
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                            <div className="flex-1">
                                                <h4 className={`font-medium ${milestone.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>
                                                    {milestone.title}
                                                </h4>
                                                {milestone.description && (
                                                    <p className="text-gray-500 text-sm">{milestone.description}</p>
                                                )}
                                            </div>
                                            {milestone.dueDate && (
                                                <span className="text-gray-500 text-xs">
                                                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Add Milestone Form */}
                                <form onSubmit={handleAddMilestone} className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <h4 className="text-white font-medium mb-3">Add New Milestone</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Milestone title"
                                            value={newMilestone.title}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                            required
                                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Description (optional)"
                                            value={newMilestone.description}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                value={newMilestone.dueDate}
                                                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                                                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-lg transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Order Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#1a1a1a]">
                            <h2 className="text-xl font-bold text-white">Create New Order</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Client *</label>
                                <select
                                    value={newOrder.client}
                                    onChange={(e) => setNewOrder({ ...newOrder, client: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                >
                                    <option value="" className="bg-[#1a1a1a]">Select a client</option>
                                    {clients.map((client) => (
                                        <option key={client._id} value={client._id} className="bg-[#1a1a1a]">
                                            {client.name} ({client.company || client.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project Title *</label>
                                <input
                                    type="text"
                                    value={newOrder.title}
                                    onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    placeholder="E-commerce Website Development"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                                <textarea
                                    value={newOrder.description}
                                    onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 resize-none"
                                    placeholder="Describe the project requirements..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={newOrder.category}
                                        onChange={(e) => setNewOrder({ ...newOrder, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    >
                                        <option value="web" className="bg-[#1a1a1a]">Web</option>
                                        <option value="mobile" className="bg-[#1a1a1a]">Mobile</option>
                                        <option value="ai" className="bg-[#1a1a1a]">AI</option>
                                        <option value="design" className="bg-[#1a1a1a]">Design</option>
                                        <option value="blockchain" className="bg-[#1a1a1a]">Blockchain</option>
                                        <option value="other" className="bg-[#1a1a1a]">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={newOrder.priority}
                                        onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    >
                                        <option value="low" className="bg-[#1a1a1a]">Low</option>
                                        <option value="medium" className="bg-[#1a1a1a]">Medium</option>
                                        <option value="high" className="bg-[#1a1a1a]">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget (USD)</label>
                                    <input
                                        type="number"
                                        value={newOrder.budget}
                                        onChange={(e) => setNewOrder({ ...newOrder, budget: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                        placeholder="5000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                                    <input
                                        type="date"
                                        value={newOrder.deadline}
                                        onChange={(e) => setNewOrder({ ...newOrder, deadline: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
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
                                    Create Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
