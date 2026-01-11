'use client'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../images/codebugfinal7.16115110.png'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#EFA130]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B2020]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-2xl mx-auto">
                {/* Logo */}
                <Link href="/" className="inline-block mb-8">
                    <Image src={Logo} alt="Codebug" width={180} height={50} className="brightness-0 invert mx-auto" />
                </Link>

                {/* 404 Text */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#EFA130] to-[#d88f20] leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 border-4 border-dashed border-white/10 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    The page you&apos;re looking for seems to have wandered off into the digital void. Let&apos;s get you back on track.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#EFA130] hover:bg-[#d88f20] text-black font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </Link>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-300"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Contact Support
                    </Link>
                </div>

                {/* Fun Bug Animation */}
                <div className="mt-12 text-gray-500 text-sm">
                    <div className="inline-flex items-center gap-2">
                        <span className="animate-bounce">🐛</span>
                        <span>Even bugs get lost sometimes...</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐛</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
