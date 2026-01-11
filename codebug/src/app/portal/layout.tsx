'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'client')) {
            router.replace('/login')
        }
    }, [isLoading, isAuthenticated, user, router])

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin w-10 h-10 border-2 border-[#EFA130] border-t-transparent rounded-full" />
                    <p className="text-gray-400 text-sm">Verifying access...</p>
                </div>
            </div>
        )
    }

    // Redirect if not authenticated as client
    if (!isAuthenticated || user?.role !== 'client') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin w-10 h-10 border-2 border-[#EFA130] border-t-transparent rounded-full" />
                    <p className="text-gray-400 text-sm">Redirecting to login...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
