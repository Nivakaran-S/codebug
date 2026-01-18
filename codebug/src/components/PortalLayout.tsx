'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface PortalLayoutProps {
    children: React.ReactNode
    title: string
    description?: string
}

const navItems = [
    {
        name: 'Dashboard',
        href: '/portal',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        name: 'My Orders',
        href: '/portal/orders',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
    },
    {
        name: 'Support Tickets',
        href: '/portal/tickets',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
        ),
    },
    {
        name: 'Profile',
        href: '/portal/profile',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
]

export default function PortalLayout({ children, title, description }: PortalLayoutProps) {
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 h-screen max-h-screen bg-[#0f0f0f] border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#EFA130] to-[#d88f20] rounded-xl flex items-center justify-center">
                                <span className="text-black font-bold text-lg">C</span>
                            </div>
                            <div>
                                <span className="text-white font-bold text-lg">Codebug</span>
                                <span className="block text-[#EFA130] text-xs">Client Portal</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-[#EFA130] text-black font-medium'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#EFA130] to-[#d88f20] rounded-full flex items-center justify-center">
                                <span className="text-black font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'C'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{user?.name || 'Client'}</p>
                                <p className="text-gray-500 text-xs truncate">{user?.email || 'client@company.com'}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 mt-3 px-4 py-2 w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10">
                    <div className="flex items-center justify-between p-4 lg:px-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-xl lg:hidden"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-xl lg:text-2xl font-bold text-white">{title}</h1>
                                {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
                            </div>
                        </div>

                        {/* Help Button */}
                        <Link
                            href="/portal/tickets"
                            className="flex items-center gap-2 px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="hidden sm:inline">Get Help</span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>

                {/* Footer */}
                <footer className="border-t border-white/10 p-4 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Codebug. All rights reserved.
                </footer>
            </div>
        </div>
    )
}
