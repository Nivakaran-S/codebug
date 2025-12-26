'use client'
import { useState } from 'react'
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import ChatBot from "../../components/ChatBot"
import ContactModal from "../../components/ContactModal"
import Link from 'next/link'

export default function Insights() {
    const [navSelection] = useState('insights')
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('all')

    const categories = [
        { key: 'all', label: 'All Articles' },
        { key: 'ai', label: 'AI & Machine Learning' },
        { key: 'design', label: 'Design & UX' },
        { key: 'development', label: 'Development' },
        { key: 'blockchain', label: 'Blockchain & Web3' },
        { key: 'industry', label: 'Industry Insights' }
    ]

    const articles = [
        {
            id: 1,
            title: 'The Future of AI in Enterprise: 2025 and Beyond',
            excerpt: 'Explore how artificial intelligence is reshaping enterprise operations, from predictive analytics to automated decision-making systems.',
            category: 'ai',
            author: 'Sarah Chen',
            role: 'CTO, Codebug AI',
            date: 'Dec 10, 2024',
            readTime: '8 min read',
            featured: true,
            color: 'from-indigo-500 to-purple-600'
        },
        {
            id: 2,
            title: 'Design Systems: Building for Scale and Consistency',
            excerpt: 'Learn how to create and implement design systems that ensure brand consistency across all digital touchpoints.',
            category: 'design',
            author: 'Marcus Williams',
            role: 'Head of Design, Codebug Studio',
            date: 'Dec 8, 2024',
            readTime: '6 min read',
            featured: false,
            color: 'from-pink-500 to-rose-600'
        },
        {
            id: 3,
            title: 'Smart Contracts 101: A Developer\'s Guide',
            excerpt: 'Everything you need to know about developing, testing, and deploying secure smart contracts on Ethereum.',
            category: 'blockchain',
            author: 'David Kim',
            role: 'Head of Blockchain, Codebug Nexus',
            date: 'Dec 5, 2024',
            readTime: '12 min read',
            featured: false,
            color: 'from-amber-500 to-orange-600'
        },
        {
            id: 4,
            title: 'Next.js 15: What\'s New and How to Migrate',
            excerpt: 'A comprehensive guide to the latest Next.js features and a step-by-step migration strategy for existing projects.',
            category: 'development',
            author: 'Elena Rodriguez',
            role: 'Head of Development, Codebug Works',
            date: 'Dec 3, 2024',
            readTime: '10 min read',
            featured: false,
            color: 'from-emerald-500 to-teal-600'
        },
        {
            id: 5,
            title: 'Building Successful Digital Products: A Framework',
            excerpt: 'Our proven methodology for taking digital products from concept to market-leading solutions.',
            category: 'industry',
            author: 'Alex Richardson',
            role: 'CEO, Codebug',
            date: 'Nov 30, 2024',
            readTime: '7 min read',
            featured: true,
            color: 'from-gray-600 to-gray-800'
        },
        {
            id: 6,
            title: 'LLMs in Production: Best Practices and Pitfalls',
            excerpt: 'Practical insights on deploying large language models in production environments, including cost optimization and safety measures.',
            category: 'ai',
            author: 'Sarah Chen',
            role: 'CTO, Codebug AI',
            date: 'Nov 28, 2024',
            readTime: '15 min read',
            featured: false,
            color: 'from-indigo-500 to-purple-600'
        },
        {
            id: 7,
            title: 'The Psychology of User Experience',
            excerpt: 'Understanding cognitive biases and psychological principles that drive user behavior and decision-making.',
            category: 'design',
            author: 'Marcus Williams',
            role: 'Head of Design, Codebug Studio',
            date: 'Nov 25, 2024',
            readTime: '9 min read',
            featured: false,
            color: 'from-pink-500 to-rose-600'
        },
        {
            id: 8,
            title: 'DeFi Revolution: Understanding Decentralized Finance',
            excerpt: 'A comprehensive overview of DeFi protocols, yield strategies, and the future of decentralized financial services.',
            category: 'blockchain',
            author: 'David Kim',
            role: 'Head of Blockchain, Codebug Nexus',
            date: 'Nov 22, 2024',
            readTime: '11 min read',
            featured: false,
            color: 'from-amber-500 to-orange-600'
        }
    ]

    const filteredArticles = activeCategory === 'all'
        ? articles
        : articles.filter(a => a.category === activeCategory)

    const featuredArticle = articles.find(a => a.featured)

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
                                <div className={`h-48 sm:h-64 lg:h-auto bg-gradient-to-br ${featuredArticle.color} relative`}>
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
                                            {featuredArticle.author.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#171717]">{featuredArticle.author}</p>
                                            <p className="text-gray-500 text-sm">{featuredArticle.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{featuredArticle.date}</span>
                                        <span>•</span>
                                        <span>{featuredArticle.readTime}</span>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filteredArticles.map((article) => (
                            <article
                                key={article.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`h-48 bg-gradient-to-br ${article.color} relative`}>
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
                                            {article.author.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[#171717]">{article.author}</p>
                                            <p className="text-xs text-gray-500">{article.date} • {article.readTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
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
                            className="flex-1 px-6 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EFA130] focus:border-transparent"
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
