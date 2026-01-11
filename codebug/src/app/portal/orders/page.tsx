'use client'
import { useState, useEffect } from 'react'
import PortalLayout from '@/components/PortalLayout'
import Link from 'next/link'
import { ordersAPI } from '@/lib/api'

export default function PortalOrders() {
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        try {
            const data = await ordersAPI.getAll()
            setOrders(data)
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredOrders = orders.filter(order =>
        filterStatus === 'all' || order.status === filterStatus
    )

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        review: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    }

    const categoryIcons: Record<string, React.ReactNode> = {
        web: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
        mobile: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
        ai: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        design: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
        blockchain: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
    }

    return (
        <PortalLayout title="My Orders" description="Track the progress of your project orders">
            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'pending', 'in-progress', 'review', 'completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filterStatus === status
                                ? 'bg-[#EFA130] text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Orders List */}
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
                    <p className="text-gray-500">Your project orders will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <Link
                            key={order._id}
                            href={`/portal/orders/${order._id}`}
                            className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#EFA130]/30 transition-all"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Icon & Title */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-[#EFA130]/20 rounded-xl flex items-center justify-center text-[#EFA130]">
                                        {categoryIcons[order.category] || categoryIcons.web}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium truncate">{order.title}</h3>
                                        <p className="text-gray-500 text-sm capitalize">{order.category} Development</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="flex items-center gap-4 lg:w-48">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-gray-400 text-xs">Progress</span>
                                            <span className="text-white text-xs font-medium">{order.progress || 0}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#EFA130] to-[#d88f20] rounded-full transition-all"
                                                style={{ width: `${order.progress || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Date */}
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                                        {order.status?.replace('-', ' ')}
                                    </span>
                                    {order.deadline && (
                                        <div className="text-right hidden sm:block">
                                            <p className="text-gray-500 text-xs">Deadline</p>
                                            <p className="text-white text-sm">{new Date(order.deadline).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Milestones Preview */}
                            {order.milestones && order.milestones.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <div className="flex gap-2 overflow-x-auto">
                                        {order.milestones.slice(0, 4).map((milestone: any, idx: number) => (
                                            <span
                                                key={idx}
                                                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${milestone.status === 'completed'
                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                        : milestone.status === 'in-progress'
                                                            ? 'bg-blue-500/20 text-blue-400'
                                                            : 'bg-white/10 text-gray-400'
                                                    }`}
                                            >
                                                {milestone.title}
                                            </span>
                                        ))}
                                        {order.milestones.length > 4 && (
                                            <span className="px-3 py-1 bg-white/5 text-gray-500 rounded-full text-xs">
                                                +{order.milestones.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </PortalLayout>
    )
}
