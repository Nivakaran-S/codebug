'use client'
import { useState, useEffect, useRef } from 'react'
import Navigation from "../components/Navigation"
import Footer from "../components/Footer"
import ChatBot from "../components/ChatBot"
import ContactModal from "../components/ContactModal"
import Image from 'next/image'
import Logo from '../images/codebugfinal7.16115110.png'
import CodebugAI from '../images/codebug-ai-2.png'
import CodebugStudio from '../images/codebug-studio-2.png'
import CodebugWorks from '../images/codebug-works-2.png'
import CodebugNexus from '../images/codebug-nexus-2.png'
import Link from 'next/link'
import { reviewsAPI } from '@/lib/api'

export default function Home() {
  const [navSelection] = useState('home')
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [counts, setCounts] = useState({ projects: 0, clients: 0, team: 0, countries: 0 })
  const [testimonials, setTestimonials] = useState<{ quote: string; author: string; role: string; avatar: string }[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch testimonials from database
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const reviews = await reviewsAPI.getPublic()
        const mapped = reviews.slice(0, 6).map((r: any) => ({
          quote: r.content,
          author: r.name,
          role: `${r.position || ''} ${r.company ? 'at ' + r.company : ''}`.trim() || 'Client',
          avatar: r.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || '?'
        }))
        setTestimonials(mapped)
      } catch (error) {
        console.error('Error loading testimonials:', error)
      }
    }
    loadTestimonials()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [statsVisible])

  useEffect(() => {
    if (statsVisible) {
      const targets = { projects: 150, clients: 50, team: 25, countries: 12 }
      const duration = 2000
      const steps = 60
      const interval = duration / steps

      let step = 0
      const timer = setInterval(() => {
        step++
        const progress = step / steps
        setCounts({
          projects: Math.floor(targets.projects * progress),
          clients: Math.floor(targets.clients * progress),
          team: Math.floor(targets.team * progress),
          countries: Math.floor(targets.countries * progress),
        })
        if (step >= steps) clearInterval(timer)
      }, interval)
    }
  }, [statsVisible])

  const entities = [
    {
      name: 'Codebug AI',
      tagline: 'Intelligence Amplified',
      description: 'Harness the power of artificial intelligence with custom ML models, intelligent chatbots, and automation solutions that transform your business operations.',
      logo: CodebugAI,
      color: 'from-indigo-500 to-purple-600',
      href: '/services#ai',
      techStack: [
        { name: 'TensorFlow', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
        { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'PyTorch', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
      ]
    },
    {
      name: 'Codebug Studio',
      tagline: 'Design That Speaks',
      description: 'Create memorable user experiences with our expert UI/UX design, brand identity, and creative solutions that captivate your audience.',
      logo: CodebugStudio,
      color: 'from-pink-500 to-rose-600',
      href: '/services#studio',
      techStack: [
        { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
        { name: 'Adobe XD', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg' },
        { name: 'Illustrator', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
        { name: 'Photoshop', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg' },
      ]
    },
    {
      name: 'Codebug Works',
      tagline: 'Build. Scale. Dominate.',
      description: 'From web applications to mobile apps and enterprise software, we build robust, scalable solutions using cutting-edge technologies.',
      logo: CodebugWorks,
      color: 'from-emerald-500 to-teal-600',
      href: '/services#works',
      techStack: [
        { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
      ]
    },
    {
      name: 'Codebug Nexus',
      tagline: 'Decentralize Everything',
      description: 'Enter the future with blockchain solutions, smart contracts, DeFi applications, and Web3 innovations that redefine possibilities.',
      logo: CodebugNexus,
      color: 'from-amber-500 to-orange-600',
      href: '/services#nexus',
      techStack: [
        { name: 'Solidity', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg' },
        { name: 'Ethereum', logo: 'https://cdn.simpleicons.org/ethereum' },
        { name: 'Polygon', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/polygon/polygon-original.svg' },
        { name: 'Web3.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/web3js/web3js-original.svg' },
      ]
    },
    {
      name: 'Codebug Spark',
      tagline: 'Connect Everything',
      description: 'Build intelligent connected systems with our IoT solutions. From smart devices to industrial automation, we bring your physical world online.',
      logo: CodebugNexus, // Placeholder - replace with CodebugSpark when logo is available
      color: 'from-cyan-500 to-blue-600',
      href: '/services#spark',
      techStack: [
        { name: 'Arduino', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
        { name: 'Raspberry Pi', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg' },
        { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'C', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
      ]
    },
  ]

  const techPartners = [
    { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
    { name: 'Google Cloud', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
    { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'TensorFlow', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
    { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  ]

  // Testimonials are now fetched from database (see useEffect above)

  const features = [
    {
      title: "End-to-End Solutions",
      description: "From concept to deployment, we handle every aspect of your digital transformation journey.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Cutting-Edge Technology",
      description: "We leverage the latest frameworks, AI models, and blockchain protocols to build future-proof solutions.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Agile & Transparent",
      description: "Regular updates, clear communication, and iterative development ensure your vision comes to life perfectly.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: "24/7 Support",
      description: "Our dedicated support team ensures your solutions run smoothly around the clock, every day of the year.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navigation navSelection={navSelection} onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <ChatBot />

      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-72 h-72 bg-[#EFA130]/10 rounded-full blur-3xl animate-float"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B2020]/10 rounded-full blur-3xl animate-float delay-300"
            style={{ transform: `translateY(${scrollY * -0.15}px)` }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4B4B4D]/5 rounded-full blur-3xl"
            style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0002})` }}
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-300 text-sm">Now accepting new projects for 2026</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in-up delay-100">
            <span className="gradient-text">The Only Bug</span>
            <br />
            <span className="text-white">You Need!</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 sm:mb-12 animate-fade-in-up delay-200 leading-relaxed px-4 sm:px-0">
            We craft exceptional digital experiences through AI, design, development, and blockchain innovation. Your vision, amplified.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <button
              onClick={() => setIsContactOpen(true)}
              className="group px-8 py-4 bg-[#EFA130] hover:bg-[#d88f20] text-black font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:gap-4"
            >
              Start Your Project
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <Link
              href="/portfolio"
              className="px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white/5"
            >
              View Our Work
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute z-10 bottom-3 left-1/2 -translate-x-1/2 animate-bounce-slow">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Entities Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Our Divisions</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mt-3 mb-6">
              Four Pillars of Innovation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized teams, unified vision. Each division brings unparalleled expertise to deliver comprehensive solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {entities.map((entity, index) => (
              <Link
                key={entity.name}
                href={entity.href}
                className="group relative bg-white rounded-2xl p-8 border border-gray-400 border-[1.8px]  transition-all duration-500 hover-lift overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className='absolute inset-0 bg-[#1D1D1D] opacity-0 group-hover:opacity-100 transition-all duration-500'></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white shadow-lg flex items-center justify-center mb-6 group-hover:bg-white/90 transition-all duration-500 p-2">
                    <Image src={entity.logo} alt={entity.name} width={64} height={64} className="object-contain" />
                  </div>
                  <h3 className="text-2xl group-hover:text-white font-bold text-[#171717] duration-500 mb-2">
                    {entity.name}
                  </h3>
                  <p className="text-[#EFA130] font-medium mb-4  duration-500">
                    {entity.tagline}
                  </p>
                  <p className="text-gray-600 group-hover:text-white duration-500 leading-relaxed">
                    {entity.description}
                  </p>

                  {/* Tech Stack Logos */}
                  <div className="mt-5 flex items-center gap-3">
                    {entity.techStack.map((tech) => (
                      <div
                        key={tech.name}
                        className="w-8 h-8 bg-gray-100 group-hover:bg-white/20 rounded-lg p-1.5 transition-all duration-300 hover:scale-110"
                        title={tech.name}
                      >
                        <img
                          src={tech.logo}
                          alt={tech.name}
                          className="w-full h-full object-contain transition-all duration-300"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center group-hover:text-white gap-2 text-[#4B4B4D]  duration-500">
                    <span className="font-medium">Explore</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Why Codebug</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mt-3 mb-6">
                Built Different, <br />
                <span className="gradient-text">Engineered Better</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We don&apos;t just build software—we architect digital ecosystems that scale.
                Our multidisciplinary approach combines world-class expertise across AI,
                design, development, and blockchain to deliver solutions that set new industry standards.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-medium">On-Time Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-medium">100% Client Satisfaction</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-medium">Post-Launch Support</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#EFA130]/10 text-[#EFA130] flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#171717] mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-24 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">By The Numbers</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
              Delivering Excellence, Consistently
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="stat-number text-[#EFA130] mb-2">{counts.projects}+</div>
              <p className="text-gray-400 font-medium">Projects Delivered</p>
            </div>
            <div className="text-center">
              <div className="stat-number text-white mb-2">{counts.clients}+</div>
              <p className="text-gray-400 font-medium">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="stat-number text-[#EFA130] mb-2">{counts.team}+</div>
              <p className="text-gray-400 font-medium">Team Members</p>
            </div>
            <div className="text-center">
              <div className="stat-number text-white mb-2">{counts.countries}+</div>
              <p className="text-gray-400 font-medium">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">Testimonials</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mt-3 mb-6">
                What Our Clients Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-[#f8f8f8] rounded-2xl p-8 relative hover-lift"
                >
                  <svg className="w-10 h-10 text-[#EFA130]/20 absolute top-6 right-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-700 mb-6 leading-relaxed relative z-10">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4B4B4D] to-[#EFA130] flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-[#171717]">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technology Partners */}
      <section className="py-16 bg-[#f8f8f8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="text-center">
            <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Technology Stack</span>
            <h3 className="text-2xl font-semibold text-[#171717] mt-2">Powered by Industry Leaders</h3>
          </div>
        </div>

        <div className="relative">
          <div className="flex gap-8 animate-[scroll_40s_linear_infinite]">
            {[...techPartners, ...techPartners].map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-8 h-8 object-contain"
                />
                <span className="text-gray-700 font-medium whitespace-nowrap">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#4B4B4D] to-[#3a3a3a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EFA130]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B2020]/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Something <span className="text-[#EFA130]">Amazing?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Let&apos;s turn your ideas into reality. Whether you need AI solutions, stunning designs,
            robust applications, or blockchain innovation, we&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsContactOpen(true)}
              className="group px-10 py-5 bg-[#EFA130] hover:bg-[#d88f20] text-black font-bold rounded-lg transition-all duration-300 flex items-center gap-3 text-lg"
            >
              Start a Conversation
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <Link
              href="/services"
              className="px-10 py-5 border-2 border-white/30 hover:border-white text-white font-bold rounded-lg transition-all duration-300 hover:bg-white/10 text-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
