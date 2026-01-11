'use client'
import { useState, useEffect } from 'react'
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import ChatBot from "../../components/ChatBot"
import ContactModal from "../../components/ContactModal"
import Link from 'next/link'
import { articlesAPI } from '@/lib/api'

const categoryColors: Record<string, string> = {
    ai: 'from-indigo-500 to-purple-600',
    design: 'from-pink-500 to-rose-600',
    development: 'from-emerald-500 to-teal-600',
    blockchain: 'from-amber-500 to-orange-600',
    business: 'from-gray-600 to-gray-800',
    tutorial: 'from-cyan-500 to-blue-600',
}

export default function Insights() {
    const [navSelection] = useState('insights')
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('all')
    const [articles, setArticles] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const categories = [
        { key: 'all', label: 'All Articles' },
        { key: 'ai', label: 'AI & Machine Learning' },
        { key: 'design', label: 'Design & UX' },
        { key: 'development', label: 'Development' },
        { key: 'blockchain', label: 'Blockchain & Web3' },
        { key: 'business', label: 'Business Insights' }
    ]

    useEffect(() => {
        loadArticles()
    }, [])

    const loadArticles = async () => {
        try {
            const data = await articlesAPI.getPublic()
            setArticles(data)
        } catch (error) {
            console.error('Error loading articles:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredArticles = activeCategory === 'all'
        ? articles
        : articles.filter(a => a.category === activeCategory)

    const featuredArticle = articles.find(a => a.isFeatured)

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

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
                            Knowledge Hub
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
                            <span className="gradient-text">Insights</span> & Ideas
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Thoughts, trends, and expertise from our team. Stay informed about the latest
                            in AI, design, development, and blockchain technology.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            {featuredArticle && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="bg-gradient-to-br from-[#f8f8f8] to-white rounded-3xl overflow-hidden border border-gray-100">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className={`h-48 sm:h-64 lg:h-auto bg-gradient-to-br ${categoryColors[featuredArticle.category] || 'from-gray-500 to-gray-600'} relative`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-white/20 text-9xl font-bold">Featured</span>
                                    </div>
                                    <div className="absolute top-6 left-6">
                                        <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                            Editor&apos;s Pick
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                                    <span className="text-[#EFA130] font-medium text-sm uppercase tracking-wider mb-3">
                                        {categories.find(c => c.key === featuredArticle.category)?.label}
                                    </span>
                                    <h2 className="text-3xl font-bold text-[#171717] mb-4">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                        {featuredArticle.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4B4B4D] to-[#EFA130] flex items-center justify-center text-white font-bold">
                                            {featuredArticle.author?.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#171717]">{featuredArticle.author?.name}</p>
                                            <p className="text-gray-500 text-sm">{featuredArticle.author?.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}</span>
                                        <span>•</span>
                                        <span>{featuredArticle.readTime} min read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Category Filter */}
            <section className="py-8 bg-white sticky top-[73px] z-40 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                        {categories.map((category) => (
                            <button
                                key={category.key}
                                onClick={() => setActiveCategory(category.key)}
                                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 cursor-pointer ${activeCategory === category.key
                                    ? 'bg-[#4B4B4D] text-white'
                                    : 'bg-[#f8f8f8] text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {isLoading ? (
                        <div className="text-center py-20 text-gray-500">Loading articles...</div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles yet</h3>
                            <p className="text-gray-500">Check back soon for our latest insights!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredArticles.map((article) => (
                                <article
                                    key={article._id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`h-48 bg-gradient-to-br ${categoryColors[article.category] || 'from-gray-500 to-gray-600'} relative`}>
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                                                {categories.find(c => c.key === article.category)?.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-[#171717] mb-3 line-clamp-2 group-hover:text-[#EFA130] transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4B4B4D] to-[#EFA130] flex items-center justify-center text-white text-sm font-bold">
                                                {article.author?.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[#171717]">{article.author?.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(article.publishedAt || article.createdAt)} • {article.readTime} min read
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 bg-[#f8f8f8]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Newsletter</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mt-3 mb-6">
                        Stay in the Loop
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Get the latest insights, trends, and updates delivered straight to your inbox.
                        No spam, just valuable content.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130] focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="px-8 py-4 bg-[#4B4B4D] hover:bg-[#EFA130] text-white hover:text-black font-semibold rounded-lg transition-all duration-300"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-sm text-gray-500 mt-4">
                        Join 5,000+ subscribers. Unsubscribe anytime.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    )
}
