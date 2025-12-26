'use client'
import { useState } from 'react'
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import ChatBot from "../../components/ChatBot"
import ContactModal from "../../components/ContactModal"
import Image from 'next/image'
import Link from 'next/link'

export default function Portfolio() {
    const [navSelection] = useState('portfolio')
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState('all')

    const projects = [
        {
            id: 1,
            title: 'NexaBank - Digital Banking Platform',
            category: 'fintech',
            entity: 'Codebug Works',
            description: 'Complete digital banking solution with real-time transactions, AI-powered fraud detection, and seamless user experience.',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'AI/ML'],
            image: '/project-placeholder.jpg',
            color: 'from-blue-500 to-indigo-600',
            stats: { users: '500K+', transactions: '$2B+', rating: '4.9' }
        },
        {
            id: 2,
            title: 'MediCare AI - Healthcare Assistant',
            category: 'ai',
            entity: 'Codebug AI',
            description: 'AI-powered healthcare platform with symptom analysis, appointment scheduling, and personalized health recommendations.',
            technologies: ['Python', 'TensorFlow', 'React Native', 'MongoDB', 'AWS'],
            image: '/project-placeholder.jpg',
            color: 'from-emerald-500 to-teal-600',
            stats: { users: '1M+', accuracy: '98%', consultations: '5M+' }
        },
        {
            id: 3,
            title: 'Artistry - NFT Marketplace',
            category: 'blockchain',
            entity: 'Codebug Nexus',
            description: 'Full-featured NFT marketplace with minting, trading, auctions, and creator royalties on Ethereum and Solana.',
            technologies: ['Solidity', 'Next.js', 'IPFS', 'Ethereum', 'Solana'],
            image: '/project-placeholder.jpg',
            color: 'from-purple-500 to-pink-600',
            stats: { volume: '$50M+', artists: '10K+', nfts: '100K+' }
        },
        {
            id: 4,
            title: 'Luxe Brand - E-commerce Redesign',
            category: 'design',
            entity: 'Codebug Studio',
            description: 'Complete brand overhaul and e-commerce redesign for a luxury fashion retailer, increasing conversions by 180%.',
            technologies: ['Figma', 'Shopify', 'React', 'Tailwind'],
            image: '/project-placeholder.jpg',
            color: 'from-rose-500 to-orange-600',
            stats: { conversion: '+180%', bounce: '-45%', sales: '+250%' }
        },
        {
            id: 5,
            title: 'DataVault - Enterprise Analytics',
            category: 'ai',
            entity: 'Codebug AI',
            description: 'Enterprise analytics platform with real-time dashboards, predictive insights, and automated reporting.',
            technologies: ['Python', 'Spark', 'Tableau', 'PostgreSQL', 'Docker'],
            image: '/project-placeholder.jpg',
            color: 'from-cyan-500 to-blue-600',
            stats: { clients: '200+', dataPoints: '10B+', uptime: '99.99%' }
        },
        {
            id: 6,
            title: 'SwiftDeliver - Logistics App',
            category: 'development',
            entity: 'Codebug Works',
            description: 'End-to-end logistics management solution with real-time tracking, route optimization, and fleet management.',
            technologies: ['React Native', 'Node.js', 'MongoDB', 'Google Maps', 'Firebase'],
            image: '/project-placeholder.jpg',
            color: 'from-amber-500 to-red-600',
            stats: { deliveries: '10M+', drivers: '50K+', countries: '15+' }
        }
    ]

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filteredProjects.map((project, index) => (
                            <div
                                key={project.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Project Image Placeholder */}
                                <div className={`h-48 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
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

                                    {/* Stats */}
                                    <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
                                        {Object.entries(project.stats).map(([key, value], i) => (
                                            <div key={key} className="text-center">
                                                <p className="text-lg font-bold text-[#171717]">{value}</p>
                                                <p className="text-xs text-gray-500 capitalize">{key}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.slice(0, 4).map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-[#f8f8f8] rounded text-xs text-gray-600"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 4 && (
                                            <span className="px-2 py-1 bg-[#f8f8f8] rounded text-xs text-gray-600">
                                                +{project.technologies.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[#f8f8f8]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
                        <div>
                            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mb-2">150+</p>
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
