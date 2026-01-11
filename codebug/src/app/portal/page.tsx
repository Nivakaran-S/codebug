'use client'
import { useState, useEffect } from 'react'
import PortalLayout from '@/components/PortalLayout'
import Link from 'next/link'
import { ordersAPI, ticketsAPI } from '@/lib/api'

export default function PortalDashboard() {
    const [stats, setStats] = useState({
        orders: { total: 0, pending: 0, inProgress: 0, completed: 0 },
        tickets: { open: 0, inProgress: 0 }
    })
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        try {
            const [ordersData, orderStats, ticketStats] = await Promise.all([
                ordersAPI.getAll(),
                ordersAPI.getStats(),
                ticketsAPI.getStats()
            ])
            setRecentOrders(ordersData.slice(0, 5))
            setStats({
                orders: orderStats,
                tickets: ticketStats
            })
        } catch (error) {
            console.error('Error loading dashboard:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-500/20 text-yellow-400',
        'in-progress': 'bg-blue-500/20 text-blue-400',
        review: 'bg-purple-500/20 text-purple-400',
        completed: 'bg-emerald-500/20 text-emerald-400',
        cancelled: 'bg-red-500/20 text-red-400'
    }

    return (
        <PortalLayout title="Dashboard" description="Welcome back! Here's an overview of your projects.">
            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#EFA130]/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#EFA130]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-white">{stats.orders.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">In Progress</p>
                                <p className="text-2xl font-bold text-white">{stats.orders.inProgress}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Completed</p>
                                <p className="text-2xl font-bold text-white">{stats.orders.completed}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Open Tickets</p>
                                <p className="text-2xl font-bold text-white">{stats.tickets.open}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                        <Link
                            href="/portal/orders"
                            className="text-[#EFA130] hover:text-[#d88f20] text-sm font-medium"
                        >
                            View All →
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading...</div>
                    ) : recentOrders.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-gray-400">No orders yet</p>
                            <p className="text-gray-500 text-sm mt-1">Your project orders will appear here</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {recentOrders.map((order) => (
                                <Link
                                    key={order._id}
                                    href={`/portal/orders/${order._id}`}
                                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{order.title}</p>
                                        <p className="text-gray-500 text-sm capitalize">{order.category}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {/* Progress */}
                                        <div className="hidden sm:flex items-center gap-2">
                                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#EFA130] rounded-full transition-all"
                                                    style={{ width: `${order.progress || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-gray-400 text-xs w-8">{order.progress || 0}%</span>
                                        </div>
                                        {/* Status */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/portal/tickets"
                        className="flex items-center gap-4 p-6 bg-gradient-to-br from-[#EFA130]/20 to-[#EFA130]/5 border border-[#EFA130]/20 rounded-2xl hover:border-[#EFA130]/40 transition-all group"
                    >
                        <div className="w-12 h-12 bg-[#EFA130] rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-medium group-hover:text-[#EFA130] transition-colors">Need Help?</p>
                            <p className="text-gray-400 text-sm">Create a support ticket</p>
                        </div>
                    </Link>

                    <Link
                        href="/portal/profile"
                        className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all group"
                    >
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-medium group-hover:text-gray-200 transition-colors">Account Settings</p>
                            <p className="text-gray-400 text-sm">Update your profile</p>
                        </div>
                    </Link>
                </div>
            </div>
        </PortalLayout>
    )
}
