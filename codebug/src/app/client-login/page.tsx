'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This page now redirects to the unified login page
// The unified login automatically detects whether user is admin or client
export default function ClientLogin() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/login')
    }, [router])

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin w-10 h-10 border-2 border-[#EFA130] border-t-transparent rounded-full" />
                <p className="text-gray-400 text-sm">Redirecting to login...</p>
            </div>
        </div>
    )
}
