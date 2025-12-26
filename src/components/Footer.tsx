'use client'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '../images/codebugfinal7.16115110.png'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const entities = [
        { name: 'Codebug AI', href: '/services#ai', description: 'AI & Machine Learning' },
        { name: 'Codebug Studio', href: '/services#studio', description: 'UI/UX Design' },
        { name: 'Codebug Works', href: '/services#works', description: 'Software Development' },
        { name: 'Codebug Nexus', href: '/services#nexus', description: 'Blockchain Solutions' },
    ]

    const quickLinks = [
        { name: 'Home', href: '/' },
        { name: 'Company', href: '/company' },
        { name: 'Services', href: '/services' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Insights', href: '/insights' },
        { name: 'Careers', href: '/careers' },
    ]

    const socialLinks = [
        {
            name: 'LinkedIn', href: 'https://linkedin.com', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            )
        },
        {
            name: 'Twitter', href: 'https://twitter.com', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            )
        },
        {
            name: 'GitHub', href: 'https://github.com', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            )
        },
        {
            name: 'Instagram', href: 'https://instagram.com', icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            )
        },
    ]

    return (
        <footer className="bg-[#0a0a0a] text-white pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 lg:mb-16">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <Image src={Logo} alt="Codebug" width={180} height={50} className="mb-6 brightness-0 invert" />
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            The Only Bug You Need! Transforming ideas into powerful digital solutions across AI, Design, Development, and Blockchain.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:bg-[#EFA130] hover:text-white transition-all duration-300"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-[#EFA130] transition-colors duration-300 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#EFA130] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Entities */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Our Entities</h4>
                        <ul className="space-y-4">
                            {entities.map((entity) => (
                                <li key={entity.name}>
                                    <Link href={entity.href} className="group">
                                        <span className="text-gray-300 group-hover:text-[#EFA130] transition-colors duration-300 font-medium">{entity.name}</span>
                                        <p className="text-sm text-gray-500">{entity.description}</p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white">Stay Connected</h4>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and insights.</p>
                        <form className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#EFA130] transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-[#EFA130] hover:bg-[#d88f20] text-black font-semibold py-3 rounded-lg transition-colors duration-300"
                            >
                                Subscribe
                            </button>
                        </form>
                        <div className="mt-6 text-gray-400 text-sm">
                            <p className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                hello@codebug.com
                            </p>
                            <p className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Global Remote Team
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>&copy; {currentYear} Codebug. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-[#EFA130] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[#EFA130] transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-[#EFA130] transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
