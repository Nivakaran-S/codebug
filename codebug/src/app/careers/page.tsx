'use client'
import { useState, useEffect } from 'react'
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import ChatBot from "../../components/ChatBot"
import ContactModal from "../../components/ContactModal"
import Link from 'next/link'
import { careersAPI } from '@/lib/api'

export default function Careers() {
    const [navSelection] = useState('careers')
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('all')
    const [positions, setPositions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const categories = [
        { key: 'all', label: 'All Positions' },
        { key: 'engineering', label: 'Engineering' },
        { key: 'design', label: 'Design' },
        { key: 'ai', label: 'AI/ML' },
        { key: 'blockchain', label: 'Blockchain' },
        { key: 'operations', label: 'Operations' }
    ]

    const benefits = [
        {
            title: 'Remote-First Culture',
            description: 'Work from anywhere in the world. We believe great talent isn\'t limited by geography.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: 'Competitive Compensation',
            description: 'Industry-leading salaries, equity options, and performance bonuses.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: 'Learning & Growth',
            description: '$2,000 annual learning budget for courses, conferences, and certifications.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            title: 'Flexible Hours',
            description: 'Results matter, not hours. Work when you\'re most productive.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: 'Health & Wellness',
            description: 'Comprehensive health insurance and wellness programs for you and your family.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            title: 'Cutting-Edge Tech',
            description: 'Work with the latest technologies. MacBook Pro, any tools you need.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        }
    ]

    useEffect(() => {
        loadPositions()
    }, [])

    const loadPositions = async () => {
        try {
            const data = await careersAPI.getOpen()
            setPositions(data)
        } catch (error) {
            console.error('Error loading positions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getExperienceLabel = (exp: any) => {
        if (!exp) return 'Any level'
        if (exp.min && exp.max) return `${exp.min}-${exp.max} years`
        if (exp.min) return `${exp.min}+ years`
        return exp.level ? `${exp.level.charAt(0).toUpperCase() + exp.level.slice(1)} level` : 'Any level'
    }

    const getDepartmentLabel = (dept: string) => {
        const labels: Record<string, string> = {
            engineering: 'Codebug Works',
            design: 'Codebug Studio',
            ai: 'Codebug AI',
            blockchain: 'Codebug Nexus',
            marketing: 'Marketing',
            operations: 'Operations',
            hr: 'HR'
        }
        return labels[dept] || dept
    }

    const filteredPositions = activeCategory === 'all'
        ? positions
        : positions.filter(p => p.department === activeCategory)

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navigation navSelection={navSelection} onContactClick={() => setIsContactOpen(true)} />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
            <ChatBot />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#EFA130]/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B2020]/10 rounded-full blur-3xl animate-float delay-300" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6 text-gray-300 text-sm">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            We&apos;re Hiring!
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
                            Join the <span className="gradient-text">Bug Squad</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Build the future with us. We&apos;re looking for passionate individuals who want to
                            make an impact. Remote-first, global team, cutting-edge projects.
                        </p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Why Join Us</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mt-3">
                            Benefits & Perks
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-[#f8f8f8] rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 rounded-xl bg-[#EFA130]/10 text-[#EFA130] flex items-center justify-center mb-6">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-[#171717] mb-3">{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-20 bg-[#f8f8f8]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Open Positions</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mt-3 mb-4">
                            Current Openings
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Find your perfect role and become part of something extraordinary.
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category.key}
                                onClick={() => setActiveCategory(category.key)}
                                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 cursor-pointer ${activeCategory === category.key
                                    ? 'bg-[#4B4B4D] text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Positions List */}
                    {isLoading ? (
                        <div className="text-center py-20 text-gray-500">Loading positions...</div>
                    ) : filteredPositions.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No open positions</h3>
                            <p className="text-gray-500">Check back soon or send us your resume for future opportunities!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredPositions.map((position) => (
                                <div
                                    key={position._id}
                                    className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#EFA130] hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-xl font-bold text-[#171717] group-hover:text-[#EFA130] transition-colors">
                                                    {position.title}
                                                </h3>
                                                <span className="px-3 py-1 bg-[#EFA130]/10 text-[#EFA130] text-xs font-medium rounded-full">
                                                    {getDepartmentLabel(position.department)}
                                                </span>
                                                {position.isUrgent && (
                                                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                                        Urgent
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-4">{position.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {position.skills?.map((skill: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-[#f8f8f8] rounded-full text-sm text-gray-600"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:items-end gap-3">
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {position.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {position.type?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                    </svg>
                                                    {getExperienceLabel(position.experience)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setIsContactOpen(true)}
                                                className="px-6 py-3 bg-[#4B4B4D] hover:bg-[#EFA130] text-white hover:text-black font-medium rounded-lg transition-all duration-300"
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-24 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Our Culture</span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-6">
                                More Than Just a Job
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                At Codebug, we&apos;re building a culture where innovation thrives, work-life balance
                                is respected, and every team member has the opportunity to grow and make an impact.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Fully remote, work from anywhere',
                                    'Quarterly team retreats (when travel is safe)',
                                    'No meetings Fridays for deep work',
                                    'Open-source contributions encouraged',
                                    'Regular hackathons and innovation days'
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-5 h-5 text-[#EFA130] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EFA130] mb-2">25+</p>
                                <p className="text-gray-400">Team Members</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">12+</p>
                                <p className="text-gray-400">Countries</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">4.9</p>
                                <p className="text-gray-400">Employee Rating</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EFA130] mb-2">95%</p>
                                <p className="text-gray-400">Retention Rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mb-6">
                        Don&apos;t See Your Role?
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        We&apos;re always looking for exceptional talent. Send us your resume and
                        tell us how you can contribute to Codebug.
                    </p>
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="group px-10 py-5 bg-[#4B4B4D] hover:bg-[#EFA130] text-white hover:text-black font-bold rounded-lg transition-all duration-300 flex items-center gap-3 mx-auto text-lg"
                    >
                        Send Your Resume
                        <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    )
}
