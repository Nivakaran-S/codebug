'use client'
import { useState, useEffect } from 'react'
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import ChatBot from "../../components/ChatBot"
import ContactModal from "../../components/ContactModal"
import Image from 'next/image'
import Link from 'next/link'
import { projectsAPI } from '@/lib/api'

const categoryColors: Record<string, string> = {
    ai: 'from-indigo-500 to-purple-600',
    design: 'from-rose-500 to-orange-600',
    development: 'from-emerald-500 to-teal-600',
    blockchain: 'from-purple-500 to-pink-600',
    fintech: 'from-blue-500 to-indigo-600',
}

export default function Portfolio() {
    const [navSelection] = useState('portfolio')
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState('all')
    const [projects, setProjects] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadProjects()
    }, [])

    const loadProjects = async () => {
        try {
            // Fetch only published projects for public portfolio
            const data = await projectsAPI.getAll({ status: 'published' })
            setProjects(data)
        } catch (error) {
            console.error('Error loading projects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filters = [
        { key: 'all', label: 'All Projects' },
        { key: 'ai', label: 'AI/ML' },
        { key: 'design', label: 'Design' },
        { key: 'development', label: 'Development' },
        { key: 'blockchain', label: 'Blockchain' },
        { key: 'fintech', label: 'FinTech' }
    ]

    const filteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(p => p.category === activeFilter)

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
                            <span className="w-2 h-2 bg-[#EFA130] rounded-full" />
                            Our Work
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
                            Featured <span className="gradient-text">Projects</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Explore our portfolio of successful projects across AI, design, development,
                            and blockchain. Each project represents our commitment to excellence.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="py-5 bg-white sticky top-[73px] z-40 border-b border-t border-gray-600">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 cursor-pointer ${activeFilter === filter.key
                                    ? 'bg-[#4B4B4D] text-white'
                                    : 'bg-[#f1f1f1] text-gray-600 ring-[0.8px] ring-gray-400 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {isLoading ? (
                        <div className="text-center py-20 text-gray-500">Loading projects...</div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
                            <p className="text-gray-500">Check back soon for our latest work!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredProjects.map((project, index) => (
                                <div
                                    key={project._id || index}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                >
                                    {/* Project Image Placeholder */}
                                    <div className={`h-48 bg-gradient-to-br ${categoryColors[project.category] || 'from-gray-500 to-gray-600'} relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white/30 text-6xl font-bold">{String(index + 1).padStart(2, '0')}</span>
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                                                {project.entity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-[#171717] mb-2 group-hover:text-[#EFA130] transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                                            {project.description}
                                        </p>

                                        {/* Technologies */}
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies?.slice(0, 4).map((tech: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-[#f8f8f8] rounded text-xs text-gray-600"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies?.length > 4 && (
                                                <span className="px-2 py-1 bg-[#f8f8f8] rounded text-xs text-gray-600">
                                                    +{project.technologies.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[#f8f8f8]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
                        <div>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mb-2">{projects.length}+</p>
                            <p className="text-gray-600">Projects Completed</p>
                        </div>
                        <div>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EFA130] mb-2">50+</p>
                            <p className="text-gray-600">Happy Clients</p>
                        </div>
                        <div>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mb-2">12+</p>
                            <p className="text-gray-600">Industries Served</p>
                        </div>
                        <div>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EFA130] mb-2">98%</p>
                            <p className="text-gray-600">Client Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-[#4B4B4D] to-[#3a3a3a]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                        Have a Project in Mind?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                        Let&apos;s discuss how we can bring your vision to life with the same
                        excellence we&apos;ve delivered in these projects.
                    </p>
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="group px-10 py-5 bg-[#EFA130] hover:bg-[#d88f20] text-black font-bold rounded-lg transition-all duration-300 flex items-center gap-3 mx-auto text-lg"
                    >
                        Start Your Project
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
