'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { dashboardAPI } from '@/lib/api'

const quickActions = [
    { label: 'New Project', href: '/admin/projects?action=new', color: 'from-emerald-500 to-teal-600', icon: '📁' },
    { label: 'New Case Study', href: '/admin/case-studies?action=new', color: 'from-blue-500 to-indigo-600', icon: '📄' },
    { label: 'View Messages', href: '/admin/messages', color: 'from-purple-500 to-pink-600', icon: '✉️' },
    { label: 'Manage Reviews', href: '/admin/reviews', color: 'from-amber-500 to-orange-600', icon: '⭐' },
]

export default function AdminDashboard() {
    const [isLoaded, setIsLoaded] = useState(false)
    const [stats, setStats] = useState({
        totalProjects: 0,
        publishedProjects: 0,
        totalMessages: 0,
        unreadMessages: 0,
        totalCaseStudies: 0,
        publishedCaseStudies: 0,
        totalReviews: 0,
        pendingReviews: 0,
        averageRating: 0
    })
    const [recentActivity, setRecentActivity] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
        setIsLoaded(true)
    }, [])

    const loadDashboardData = async () => {
        try {
            const data = await dashboardAPI.getStats()
            if (data) {
                setStats({
                    totalProjects: data.totalProjects || 0,
                    publishedProjects: data.publishedProjects || 0,
                    totalMessages: data.totalMessages || 0,
                    unreadMessages: data.unreadMessages || 0,
                    totalCaseStudies: data.totalCaseStudies || 0,
                    publishedCaseStudies: data.publishedCaseStudies || 0,
                    totalReviews: data.totalReviews || 0,
                    pendingReviews: data.pendingReviews || 0,
                    averageRating: data.averageRating || 0
                })
                setRecentActivity(data.recentActivity || [])
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const StatCard = ({ title, value, subValue, trend, icon, color }: {
        title: string;
        value: number | string;
        subValue?: string;
        trend?: { value: number; positive: boolean };
        icon: React.ReactNode;
        color: string;
    }) => (
        <div className={`relative overflow-hidden bg-gradient-to-br ${color} rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-white/60 text-sm font-medium">{title}</span>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{isLoading ? '...' : value}</p>
                {subValue && <p className="text-white/70 text-sm">{subValue}</p>}
                {trend && (
                    <div className={`inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-full text-xs font-medium ${trend.positive ? 'bg-emerald-500/30 text-emerald-100' : 'bg-red-500/30 text-red-100'}`}>
                        <svg className={`w-3 h-3 ${trend.positive ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        {trend.value}% vs last month
                    </div>
                )}
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full" />
        </div>
    )

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'message': return '✉️'
            case 'review': return '⭐'
            case 'project': return '📁'
            case 'case-study': return '📄'
            default: return '📌'
        }
    }

    const formatTimeAgo = (date: string) => {
        const now = new Date()
        const then = new Date(date)
        const diffMs = now.getTime() - then.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 60) return `${diffMins} minutes ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        return `${diffDays} days ago`
    }

    return (
        <AdminLayout
            title="Dashboard"
            description="Welcome back! Here's what's happening with your portfolio."
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <StatCard
                    title="Total Projects"
                    value={stats.totalProjects}
                    subValue={`${stats.publishedProjects} published`}
                    color="from-[#4B4B4D] to-[#3a3a3a]"
                    icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                />
                <StatCard
                    title="Messages"
                    value={stats.totalMessages}
                    subValue={`${stats.unreadMessages} unread`}
                    color="from-purple-600 to-indigo-700"
                    icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />
                <StatCard
                    title="Case Studies"
                    value={stats.totalCaseStudies}
                    subValue={`${stats.publishedCaseStudies} published`}
                    color="from-emerald-600 to-teal-700"
                    icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                />
                <StatCard
                    title="Avg. Rating"
                    value={stats.averageRating.toFixed(1)}
                    subValue={`${stats.totalReviews} reviews (${stats.pendingReviews} pending)`}
                    color="from-[#EFA130] to-[#d88f20]"
                    icon={<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                        <Link href="/admin/messages" className="text-sm text-[#EFA130] hover:text-[#d88f20] transition-colors">View all</Link>
                    </div>
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="text-center py-8 text-gray-500">Loading activity...</div>
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No recent activity</div>
                        ) : (
                            recentActivity.slice(0, 5).map((activity, index) => (
                                <div
                                    key={activity._id || index}
                                    className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer
                                        ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">{activity.title}</p>
                                        <p className="text-gray-500 text-xs">{formatTimeAgo(activity.createdAt)}</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickActions.map((action, index) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={`flex items-center gap-4 p-4 bg-gradient-to-r ${action.color} rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-lg
                                    ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <span className="text-2xl">{action.icon}</span>
                                <span className="text-white font-medium">{action.label}</span>
                                <svg className="w-5 h-5 text-white/70 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        ))}
                    </div>

                    {/* Performance Summary */}
                    <div className="mt-8 p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border border-white/5">
                        <h3 className="text-sm font-medium text-gray-400 mb-4">Summary</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Published Projects</span>
                                    <span className="text-white font-medium">{stats.publishedProjects}/{stats.totalProjects}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: stats.totalProjects > 0 ? `${(stats.publishedProjects / stats.totalProjects) * 100}%` : '0%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Messages Read</span>
                                    <span className="text-white font-medium">{stats.totalMessages - stats.unreadMessages}/{stats.totalMessages}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: stats.totalMessages > 0 ? `${((stats.totalMessages - stats.unreadMessages) / stats.totalMessages) * 100}%` : '0%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Reviews Approved</span>
                                    <span className="text-white font-medium">{stats.totalReviews - stats.pendingReviews}/{stats.totalReviews}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#EFA130] to-[#d88f20] rounded-full" style={{ width: stats.totalReviews > 0 ? `${((stats.totalReviews - stats.pendingReviews) / stats.totalReviews) * 100}%` : '0%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
