'use client'
import { useState } from 'react'
import Navigation from "../../components/Navigation"
import Footer from "../../components/Footer"
import ChatBot from "../../components/ChatBot"
import ContactModal from "../../components/ContactModal"
import Image from 'next/image'
import CodebugMini from '../../images/codebug-mini.png'
import CodebugAI from '../../images/codebug-ai-2.png'
import CodebugStudio from '../../images/codebug-studio-2.png'
import CodebugWorks from '../../images/codebug-works-2.png'
import CodebugNexus from '../../images/codebug-nexus-2.png'
import Link from 'next/link'

export default function Services() {
    const [navSelection] = useState('services')
    const [isContactOpen, setIsContactOpen] = useState(false)

    // Technology logo mappings
    const techLogos: { [key: string]: string } = {
        'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
        'PyTorch': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
        'LangChain': 'https://cdn.simpleicons.org/langchain',
        'Hugging Face': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
        'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        'Scikit-learn': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg',
        'Keras': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg',
        'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
        'Adobe XD': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-original.svg',
        'Sketch': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg',
        'Framer': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg',
        'Principle': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
        'After Effects': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg',
        'Illustrator': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
        'Photoshop': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg',
        'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
        'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
        'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
        'Solidity': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg',
        'Rust': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg',
        'Ethereum': 'https://cdn.simpleicons.org/ethereum',
        'Solana': 'https://cdn.simpleicons.org/solana',
        'Web3.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/web3js/web3js-original.svg',
        'Hardhat': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/hardhat/hardhat-original.svg',
        'IPFS': 'https://cdn.simpleicons.org/ipfs',
        'The Graph': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg',
        'Arduino': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
        'Raspberry Pi': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg',
        'ESP32': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/embeddedc/embeddedc-original.svg',
        'MQTT': 'https://cdn.simpleicons.org/mqtt',
        'C/C++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
        'AWS IoT': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
        'Azure IoT': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
        'Custom PCB': 'https://cdn.simpleicons.org/kicad',
    }

    const entities = [
        {
            id: 'ai',
            name: 'Codebug AI',
            tagline: 'Intelligence Amplified',
            description: 'Transform your business with cutting-edge artificial intelligence solutions. From machine learning models to intelligent automation, we build AI that delivers real results.',
            color: 'from-indigo-500 to-purple-600',
            bgColor: 'bg-indigo-500/10',
            services: [
                {
                    title: 'Custom AI/ML Solutions',
                    description: 'Tailored machine learning models designed for your specific business needs, from predictive analytics to recommendation engines.'
                },
                {
                    title: 'Intelligent Chatbots',
                    description: 'Natural language processing-powered conversational AI that enhances customer experience and automates support.'
                },
                {
                    title: 'Computer Vision',
                    description: 'Image and video analysis solutions for object detection, facial recognition, and visual inspection systems.'
                },
                {
                    title: 'Process Automation',
                    description: 'AI-driven automation that streamlines workflows, reduces manual tasks, and increases operational efficiency.'
                },
                {
                    title: 'Predictive Analytics',
                    description: 'Data-driven insights that help you anticipate trends, optimize operations, and make informed decisions.'
                },
                {
                    title: 'AI Integration',
                    description: 'Seamlessly integrate AI capabilities into your existing systems with APIs and custom implementations.'
                }
            ],
            technologies: ['TensorFlow', 'PyTorch', 'LangChain', 'Hugging Face', 'Python', 'Scikit-learn', 'Keras'],
            logo: CodebugAI
        },
        {
            id: 'studio',
            name: 'Codebug Studio',
            tagline: 'Design That Speaks',
            description: 'Create unforgettable user experiences with our design expertise. We blend aesthetics with functionality to craft interfaces that captivate and convert.',
            color: 'from-pink-500 to-rose-600',
            bgColor: 'bg-pink-500/10',
            services: [
                {
                    title: 'UI/UX Design',
                    description: 'User-centered design that balances visual appeal with intuitive functionality for web and mobile applications.'
                },
                {
                    title: 'Brand Identity',
                    description: 'Comprehensive branding solutions including logos, color systems, typography, and brand guidelines.'
                },
                {
                    title: 'Design Systems',
                    description: 'Scalable component libraries and design tokens that ensure consistency across all your digital products.'
                },
                {
                    title: 'Prototyping',
                    description: 'Interactive prototypes that bring your ideas to life, enabling user testing and stakeholder validation.'
                },
                {
                    title: 'User Research',
                    description: 'In-depth user studies, personas, journey mapping, and usability testing to inform design decisions.'
                },
                {
                    title: 'Motion Design',
                    description: 'Micro-interactions and animations that enhance user engagement and bring interfaces to life.'
                }
            ],
            technologies: ['Figma', 'Adobe XD', 'Sketch', 'Framer', 'Principle', 'After Effects', 'Illustrator', 'Photoshop'],
            logo: CodebugStudio
        },
        {
            id: 'works',
            name: 'Codebug Works',
            tagline: 'Build. Scale. Dominate.',
            description: 'From web applications to mobile apps and enterprise software, we architect and build robust, scalable solutions using cutting-edge technologies.',
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-500/10',
            services: [
                {
                    title: 'Web Development',
                    description: 'Modern, responsive web applications built with React, Next.js, Vue, and other cutting-edge frameworks.'
                },
                {
                    title: 'Mobile Development',
                    description: 'Native and cross-platform mobile apps for iOS and Android using React Native, Flutter, and Swift.'
                },
                {
                    title: 'Enterprise Software',
                    description: 'Custom enterprise solutions including ERPs, CRMs, and workflow management systems.'
                },
                {
                    title: 'API Development',
                    description: 'RESTful and GraphQL APIs designed for performance, security, and seamless integration.'
                },
                {
                    title: 'Cloud Solutions',
                    description: 'Cloud architecture, migration, and DevOps services on AWS, GCP, and Azure platforms.'
                },
                {
                    title: 'E-Commerce',
                    description: 'Scalable online stores with payment integration, inventory management, and analytics.'
                }
            ],
            technologies: ['React', 'Next.js', 'Node.js', 'Python', 'TypeScript', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS'],
            logo: CodebugWorks
        },
        {
            id: 'nexus',
            name: 'Codebug Nexus',
            tagline: 'Decentralize Everything',
            description: 'Enter the future with blockchain solutions, smart contracts, DeFi applications, and Web3 innovations that redefine what\'s possible.',
            color: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-500/10',
            services: [
                {
                    title: 'Smart Contracts',
                    description: 'Secure, audited smart contracts on Ethereum, Solana, and other blockchain networks.'
                },
                {
                    title: 'DeFi Applications',
                    description: 'Decentralized finance solutions including DEXs, lending protocols, and yield farming platforms.'
                },
                {
                    title: 'NFT Platforms',
                    description: 'End-to-end NFT solutions from minting to marketplaces, with support for various standards.'
                },
                {
                    title: 'dApp Development',
                    description: 'Full-stack decentralized applications with Web3 integration and wallet connectivity.'
                },
                {
                    title: 'Tokenization',
                    description: 'Token creation, ICO/IDO platforms, and tokenomics consulting for your blockchain projects.'
                },
                {
                    title: 'Blockchain Consulting',
                    description: 'Strategic guidance on blockchain adoption, technology selection, and implementation roadmaps.'
                }
            ],
            technologies: ['Solidity', 'Rust', 'Ethereum', 'Solana', 'Web3.js', 'Hardhat', 'IPFS', 'The Graph'],
            logo: CodebugNexus
        },
        {
            id: 'spark',
            name: 'Codebug Spark',
            tagline: 'Connect Everything',
            description: 'Build intelligent connected systems with our IoT solutions. From smart devices to industrial automation, we bring your physical world online.',
            color: 'from-cyan-500 to-blue-600',
            bgColor: 'bg-cyan-500/10',
            services: [
                {
                    title: 'Smart Sensors & Devices',
                    description: 'Custom IoT sensor networks and smart device development for real-time data collection and monitoring.'
                },
                {
                    title: 'Industrial Automation',
                    description: 'Industry 4.0 solutions for manufacturing, logistics, and operations optimization.'
                },
                {
                    title: 'Connected Home & Building',
                    description: 'Smart home and building automation systems with seamless integration and control.'
                },
                {
                    title: 'Edge Computing',
                    description: 'On-device processing and edge AI solutions for low-latency IoT applications.'
                },
                {
                    title: 'IoT Security',
                    description: 'Secure device communication, firmware protection, and vulnerability assessment for IoT systems.'
                },
                {
                    title: 'Remote Monitoring',
                    description: 'Real-time dashboards and alerting systems for monitoring distributed IoT networks.'
                }
            ],
            technologies: ['Arduino', 'Raspberry Pi', 'ESP32', 'MQTT', 'Python', 'C/C++', 'AWS IoT', 'Azure IoT', 'Custom PCB'],
            logo: CodebugNexus // Placeholder - replace with CodebugSpark when logo is available
        }
    ]

    const process = [
        {
            step: '01',
            title: 'Discovery',
            description: 'We dive deep into understanding your business, goals, and challenges to define the perfect solution.'
        },
        {
            step: '02',
            title: 'Strategy',
            description: 'Our team crafts a comprehensive roadmap with clear milestones, technologies, and deliverables.'
        },
        {
            step: '03',
            title: 'Design & Build',
            description: 'Agile development with regular updates, ensuring your vision comes to life exactly as imagined.'
        },
        {
            step: '04',
            title: 'Launch & Scale',
            description: 'Smooth deployment with ongoing support to ensure your solution grows with your business.'
        }
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
                            Four Specialized Divisions
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6">
                            Our <span className="gradient-text">Services</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Comprehensive digital solutions across AI, design, development, and blockchain.
                            Each division brings specialized expertise to deliver exceptional results.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Navigation */}
            <section className="py-8 bg-[#f8f8f8] border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                        {entities.map((entity) => (
                            <a
                                key={entity.id}
                                href={`#${entity.id}`}
                                className={`px-4 text-gray-900 ring-[1px] ring-gray-500 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 hover:scale-105 ${entity.bgColor} hover:shadow-lg`}
                            >
                                {entity.name}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Entity Sections */}
            {entities.map((entity, index) => (
                <section
                    key={entity.id}
                    id={entity.id}
                    className={`py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-[#f8f8f8]'}`}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Entity Header */}
                        <div className="flex flex-col lg:flex-row items-start gap-12 mb-16">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-lg flex items-center justify-center flex-shrink-0 p-3">
                                <Image src={entity.logo} alt={entity.name} width={80} height={80} className="object-contain" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <Image src={CodebugMini} alt="Codebug" width={28} height={28} className="object-contain" />
                                    <span className="text-gray-500 text-sm font-medium">Codebug Division</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mb-3">{entity.name}</h2>
                                <p className={`text-xl font-semibold bg-gradient-to-r ${entity.color} bg-clip-text text-transparent mb-4`}>
                                    {entity.tagline}
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                                    {entity.description}
                                </p>
                            </div>
                        </div>

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
                            {entity.services.map((service, sIndex) => (
                                <div
                                    key={sIndex}
                                    className="bg-white hover:scale-105 rounded-xl p-6 border border-gray-600 hover:border-gray-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`w-10 h-10 rounded-lg ${entity.bgColor} flex items-center justify-center mb-4`}>
                                        <span className={`text-lg font-bold bg-gradient-to-r ${entity.color} bg-clip-text text-transparent`}>
                                            {String(sIndex + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#171717] mb-2">{service.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <span className="text-gray-500 font-medium mr-1 sm:mr-2 w-full sm:w-auto mb-2 sm:mb-0">Technologies:</span>
                            {entity.technologies.map((tech, tIndex) => (
                                <div
                                    key={tIndex}
                                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full border border-gray-500 hover:border-gray-400 hover:shadow-md transition-all duration-300 hover:scale-105"
                                    title={tech}
                                >
                                    {techLogos[tech] && (
                                        <img
                                            src={techLogos[tech]}
                                            alt={tech}
                                            className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                                        />
                                    )}
                                    <span className="text-xs sm:text-sm text-gray-700 font-medium">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* Our Process */}
            <section className="py-24 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-[#EFA130] font-semibold text-sm uppercase tracking-wider">How We Work</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
                            Our Process
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((item, index) => (
                            <div key={index} className="relative">
                                
                                <div className="text-7xl font-bold text-white/5 absolute -top-4 -left-2">{item.step}</div>
                                <div className="relative z-10 pt-8">
                                    <div className="w-12 h-12 rounded-full bg-[#EFA130] text-black font-bold flex items-center justify-center mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                                </div>
                                {index  < process.length && (
                                    <div className="hidden lg:block absolute top-16  w-full h-0.5 bg-gradient-to-r from-[#EFA130] to-transparent -translate-x-8" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        Tell us about your project and let&apos;s explore how our specialized teams can bring your vision to life.
                    </p>
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="group px-10 py-5 bg-[#4B4B4D] hover:bg-[#EFA130] text-white hover:text-black font-bold rounded-lg transition-all duration-300 flex items-center gap-3 mx-auto text-lg"
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
