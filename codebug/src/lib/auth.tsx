'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI } from '@/lib/api'
import { useRouter, usePathname } from 'next/navigation'

interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'client'
    company?: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    unifiedLogin: (email: string, password: string) => Promise<{ success: boolean; redirectTo?: string; error?: string }>
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    clientLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // Check authentication status on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const userData = await authAPI.checkAuth()
            setUser({
                id: userData.id,
                name: userData.name || '',
                email: userData.email,
                role: userData.role as 'admin' | 'client',
            })
        } catch (error) {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    // Unified login - automatically detects admin or client
    const unifiedLogin = async (email: string, password: string) => {
        try {
            const response = await authAPI.unifiedLogin(email, password)
            setUser({
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: response.user.role as 'admin' | 'client',
                company: response.user.company,
            })
            return { success: true, redirectTo: response.redirectTo }
        } catch (error: any) {
            return { success: false, error: error.message || 'Invalid email or password' }
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login(email, password)
            setUser({
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: 'admin',
            })
            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message || 'Login failed' }
        }
    }

    const clientLogin = async (email: string, password: string) => {
        try {
            const response = await authAPI.clientLogin(email, password)
            setUser({
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: 'client',
                company: response.user.company,
            })
            return { success: true }
        } catch (error: any) {
            return { success: false, error: error.message || 'Login failed' }
        }
    }

    const logout = async () => {
        try {
            await authAPI.logout()
        } catch (error) {
            // Ignore logout errors
        } finally {
            setUser(null)
            router.push('/')
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                unifiedLogin,
                login,
                clientLogin,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// HOC for protecting admin routes
export function withAdminAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function ProtectedComponent(props: P) {
        const { user, isLoading, isAuthenticated } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
                router.replace('/login')
            }
        }, [isLoading, isAuthenticated, user, router])

        if (isLoading) {
            return (
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-[#EFA130] border-t-transparent rounded-full" />
                </div>
            )
        }

        if (!isAuthenticated || user?.role !== 'admin') {
            return null
        }

        return <WrappedComponent {...props} />
    }
}

// HOC for protecting client routes
export function withClientAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function ProtectedComponent(props: P) {
        const { user, isLoading, isAuthenticated } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!isLoading && (!isAuthenticated || user?.role !== 'client')) {
                router.replace('/login')
            }
        }, [isLoading, isAuthenticated, user, router])

        if (isLoading) {
            return (
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-2 border-[#EFA130] border-t-transparent rounded-full" />
                </div>
            )
        }

        if (!isAuthenticated || user?.role !== 'client') {
            return null
        }

        return <WrappedComponent {...props} />
    }
}
