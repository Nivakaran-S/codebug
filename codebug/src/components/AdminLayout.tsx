'use client'
import { useState, ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    actions?: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, description, actions }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        {/* Mobile Menu Button & Title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-white">{title}</h1>
                                {description && (
                                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">{description}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {actions}

                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EFA130] rounded-full"></span>
                            </button>

                            {/* Search */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent text-white text-sm w-32 lg:w-48 focus:outline-none placeholder-gray-500"
                                />
                                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] text-gray-500 bg-white/5 rounded">⌘K</kbd>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

                {/* Footer */}
                <footer className="px-4 sm:px-6 lg:px-8 py-4 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                        <p>© 2025 Codebug. All rights reserved.</p>
                        <p>Admin Dashboard v1.0</p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default AdminLayout
