'use client'
import { useState } from 'react'
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import ChatBot from "../../components/ChatBot"
import ContactModal from "../../components/ContactModal"
import Image from 'next/image'
import Logo from '../../images/codebugfinal7.16115110.png'

export default function Company() {
    const [navSelection] = useState('company')
    const [isContactOpen, setIsContactOpen] = useState(false)

    const values = [
        {
            title: 'Innovation First',
            description: 'We push boundaries and embrace emerging technologies to deliver solutions that set new standards.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            title: 'Excellence Always',
            description: 'Quality isn\'t negotiable. We deliver work that we\'re proud of, every single time.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            )
        },
        {
            title: 'Client Partnership',
            description: 'Your success is our success. We build lasting relationships based on trust and results.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            title: 'Continuous Learning',
            description: 'Technology evolves rapidly. We stay ahead through constant learning and adaptation.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        }
    ]

    const milestones = [
        { year: '2025', title: 'Founded', description: 'Codebug was born with a vision to democratize technology and deliver exceptional digital solutions.' }
    ]

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
                            About Codebug
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
                            We Build the <span className="gradient-text">Future</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            A collective of passionate technologists, designers, and innovators united by a
                            common mission: to transform ideas into exceptional digital experiences.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Our Mission</span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mt-3 mb-6">
                                Empowering Businesses Through Technology
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                At Codebug, we believe that exceptional technology should be accessible to everyone.
                                We partner with businesses of all sizes—from ambitious startups to established enterprises—to
                                deliver solutions that drive growth, efficiency, and innovation.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Founded in 2025, our multidisciplinary approach combines deep expertise in AI, design, development,
                                and blockchain to tackle complex challenges and create solutions that truly make a difference.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-[#f8f8f8] px-4 py-2 rounded-full">
                                    <svg className="w-5 h-5 text-[#EFA130]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700 font-medium">Remote-First</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#f8f8f8] px-4 py-2 rounded-full">
                                    <svg className="w-5 h-5 text-[#EFA130]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700 font-medium">Global Team</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#f8f8f8] px-4 py-2 rounded-full">
                                    <svg className="w-5 h-5 text-[#EFA130]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700 font-medium">Agile Methodology</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-[#4B4B4D] to-[#2a2a2a] rounded-2xl p-12 text-center">
                                <Image src={Logo} alt="Codebug" width={200} height={60} className="mx-auto mb-8 brightness-0 invert" />
                                <p className="text-3xl font-bold text-white mb-2">The Only Bug</p>
                                <p className="text-3xl font-bold text-[#EFA130]">You Need!</p>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#EFA130]/20 rounded-full blur-2xl" />
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#8B2020]/20 rounded-full blur-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-[#f8f8f8]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Our Values</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mt-3">
                            What Drives Us
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 rounded-xl bg-[#EFA130]/10 text-[#EFA130] flex items-center justify-center mx-auto mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-[#171717] mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Our Journey</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mt-3">
                            Just Getting Started
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#EFA130] via-[#4B4B4D] to-[#EFA130] hidden lg:block" />

                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className={`relative flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                        }`}
                                >
                                    <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                        <div className={`bg-[#f8f8f8] rounded-xl p-6 inline-block ${index % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                                            <span className="text-[#EFA130] font-bold text-lg">{milestone.year}</span>
                                            <h3 className="text-xl font-semibold text-[#171717] mt-1">{milestone.title}</h3>
                                            <p className="text-gray-600 mt-2">{milestone.description}</p>
                                        </div>
                                    </div>

                                    <div className="w-12 h-12 rounded-full bg-[#4B4B4D] text-white flex items-center justify-center font-bold z-10 flex-shrink-0">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 hidden lg:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mb-6">
                        Want to Join Our Journey?
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Whether you&apos;re a potential client or looking to join our team, we&apos;d love to hear from you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="group px-10 py-5 bg-[#4B4B4D] hover:bg-[#EFA130] text-white hover:text-black font-bold rounded-lg transition-all duration-300 flex items-center gap-3 text-lg"
                        >
                            Get in Touch
                            <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                        <a
                            href="/careers"
                            className="px-10 py-5 border-2 border-[#4B4B4D] hover:border-[#EFA130] text-[#4B4B4D] hover:text-[#EFA130] font-bold rounded-lg transition-all duration-300 text-lg"
                        >
                            View Careers
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
