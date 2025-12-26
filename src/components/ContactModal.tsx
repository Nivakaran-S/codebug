'use client'
import { useState } from 'react'

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
        { value: 'ai', label: 'Codebug AI - AI/ML Solutions' },
        { value: 'studio', label: 'Codebug Studio - UI/UX Design' },
        { value: 'works', label: 'Codebug Works - Software Development' },
        { value: 'nexus', label: 'Codebug Nexus - Blockchain Solutions' },
        { value: 'multiple', label: 'Multiple Services' },
        { value: 'other', label: 'Not Sure / Other' },
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
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#4B4B4D] to-[#3a3a3a] px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Let&apos;s Talk</h2>
                            <p className="text-gray-300 mt-1">Tell us about your project</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto flex-1">
                    {isSubmitted ? (
                        <div className="text-center py-8 animate-scale-in">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
                            <p className="text-gray-600">We&apos;ll get back to you within 24 hours.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EFA130] focus:border-transparent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EFA130] focus:border-transparent transition-all"
                                        placeholder="john@company.com"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EFA130] focus:border-transparent transition-all"
                                    placeholder="Your Company"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                                    Service Interested In *
                                </label>
                                <select
                                    id="service"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EFA130] focus:border-transparent transition-all appearance-none bg-white"
                                >
                                    <option value="">Select a service</option>
                                    {services.map(service => (
                                        <option key={service.value} value={service.value}>{service.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Details *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EFA130] focus:border-transparent transition-all resize-none"
                                    placeholder="Tell us about your project, goals, and timeline..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#4B4B4D] hover:bg-[#EFA130] text-white font-semibold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
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
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-500 mt-4">
                                By submitting, you agree to our{' '}
                                <a href="/privacy" className="text-[#EFA130] hover:underline">Privacy Policy</a>
                            </p>
                        </>
                    )}
                </form>
            </div>
        </div>
    )
}

export default ContactModal
