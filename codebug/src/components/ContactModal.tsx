'use client'
import { useState } from 'react'
import Image from 'next/image'
import CodebugMini from '../images/codebug-mini.png'

interface ContactModalProps {
    isOpen: boolean
    onClose: () => void
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        service: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const services = [
        { value: 'ai', label: 'Codebug AI - AI/ML Solutions', icon: '🤖' },
        { value: 'studio', label: 'Codebug Studio - UI/UX Design', icon: '🎨' },
        { value: 'works', label: 'Codebug Works - Software Development', icon: '⚡' },
        { value: 'nexus', label: 'Codebug Nexus - Blockchain Solutions', icon: '🔗' },
        { value: 'spark', label: 'Codebug Spark - IoT Solutions', icon: '💡' },
        { value: 'multiple', label: 'Multiple Services', icon: '📦' },
        { value: 'other', label: 'Not Sure / Other', icon: '💬' },
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset after showing success
        setTimeout(() => {
            setIsSubmitted(false)
            setFormData({ name: '', email: '', company: '', service: '', message: '' })
            onClose()
        }, 2000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
                style={{ animation: 'fadeIn 0.3s ease-out' }}
            />

            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-visible"
                style={{ animation: 'scaleIn 0.3s ease-out' }}
            >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#EFA130] via-[#8B2020] to-[#4B4B4D] rounded-3xl p-[2px]">
                    <div className="absolute inset-[2px] bg-[#0a0a0a] rounded-[22px]" />
                </div>

                {/* Modal Content */}
                <div className="relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] rounded-3xl shadow-2xl flex flex-col border border-white/10 max-h-[90vh] overflow-hidden">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 z-20 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EFA130]/20 to-[#8B2020]/20 border border-white/10 flex items-center justify-center">
                                <Image src={CodebugMini} alt="Codebug" width={36} height={36} className="object-contain" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">Let&apos;s Talk</h2>
                                <p className="text-gray-400 text-sm">Tell us about your project</p>
                            </div>
                        </div>

                        {/* Decorative line */}
                        <div className="h-px bg-gradient-to-r from-transparent via-[#EFA130]/50 to-transparent" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 pb-8 overflow-y-auto flex-1">
                        {isSubmitted ? (
                            <div className="text-center py-12" style={{ animation: 'scaleIn 0.3s ease-out' }}>
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-gray-400">We&apos;ll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <>
                                {/* Name & Email Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                    <div className="group">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-[#EFA130] transition-colors">
                                            Your Name <span className="text-[#EFA130]">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EFA130]/50 focus:bg-white/10 transition-all duration-300"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-[#EFA130] transition-colors">
                                            Email Address <span className="text-[#EFA130]">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </span>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EFA130]/50 focus:bg-white/10 transition-all duration-300"
                                                placeholder="john@company.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Company */}
                                <div className="mb-5 group">
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-[#EFA130] transition-colors">
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EFA130]/50 focus:bg-white/10 transition-all duration-300"
                                            placeholder="Your Company"
                                        />
                                    </div>
                                </div>

                                {/* Service Selection */}
                                <div className="mb-5 group">
                                    <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-[#EFA130] transition-colors">
                                        Service Interested In <span className="text-[#EFA130]">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </span>
                                        <select
                                            id="service"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#EFA130]/50 focus:bg-white/10 transition-all duration-300 appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#1a1a1a] text-gray-400">Select a service</option>
                                            {services.map(service => (
                                                <option key={service.value} value={service.value} className="bg-[#1a1a1a]">
                                                    {service.icon} {service.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="mb-6 group">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-[#EFA130] transition-colors">
                                        Project Details <span className="text-[#EFA130]">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-4 text-gray-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </span>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EFA130]/50 focus:bg-white/10 transition-all duration-300 resize-none"
                                            placeholder="Tell us about your project, goals, and timeline..."
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full group relative overflow-hidden bg-gradient-to-r from-[#EFA130] to-[#d98f2a] text-black font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 hover:shadow-lg hover:shadow-[#EFA130]/25 cursor-pointer"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </button>

                                {/* Footer Note */}
                                <p className="text-center text-sm text-gray-500 mt-5">
                                    By submitting, you agree to our{' '}
                                    <a href="/privacy" className="text-[#EFA130] hover:underline transition-colors">Privacy Policy</a>
                                </p>
                            </>
                        )}
                    </form>
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { 
                        opacity: 0; 
                        transform: scale(0.95) translateY(10px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1) translateY(0); 
                    }
                }
            `}</style>
        </div>
    )
}

export default ContactModal
