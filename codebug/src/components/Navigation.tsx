'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import Image from "next/image";
import Logo from '../images/codebugfinal7.16115110.png'

interface ContactModelProps {
    onContactClick: () => void;
    navSelection: string;
}

const Navigation: React.FC<ContactModelProps> = ({ navSelection, onContactClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const Router = useRouter()

    const onHomeClick = () => {
        Router.push('/')
        setIsMenuOpen(false)
    }

    const onAboutClick = () => {
        Router.push('/company')
        setIsMenuOpen(false)
    }

    const onServicesClick = () => {
        Router.push('/services')
        setIsMenuOpen(false)
    }

    const onPortfolioClick = () => {
        Router.push('/portfolio')
        setIsMenuOpen(false)
    }

    const onResourcesClick = () => {
        Router.push('/insights')
        setIsMenuOpen(false)
    }

    const onCareersClick = () => {
        Router.push('/careers')
        setIsMenuOpen(false)
    }

    const onMenuClick = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const navLinks = [
        { key: 'home', label: 'Home', onClick: onHomeClick },
        { key: 'company', label: 'Company', onClick: onAboutClick },
        { key: 'services', label: 'Services', onClick: onServicesClick },
        { key: 'portfolio', label: 'Portfolio', onClick: onPortfolioClick },
        { key: 'insights', label: 'Insights', onClick: onResourcesClick },
        { key: 'careers', label: 'Careers', onClick: onCareersClick },
    ]

    return (
        <>
            {/* Desktop Navigation */}
            <div className="flex items-center z-[999] fixed top-0 w-full justify-center">
                <div className="lg:flex hidden flex-row justify-between items-center px-5 h-[60px] 2xl:h-[65px] rounded-lg ring-[0.5px] ring-[#727376] w-[90vw] xl:w-[75vw] mt-[13px] bg-white text-black shadow-lg">
                    <a href="/">
                        <div className="cursor-pointer flex flex-row items-center justify-center">
                            <Image alt="Codebug" src={Logo} height={50} width={180} />
                        </div>
                    </a>
                    <div className="flex flex-row items-center text-base lg:text-lg justify-between text-black w-auto lg:w-[50%] gap-4 lg:gap-0">
                        {navLinks.map((link) => (
                            <div
                                key={link.key}
                                onClick={link.onClick}
                                className={`${navSelection === link.key ? 'text-[#8B2020]' : ''} cursor-pointer hover:text-[#EFA130] transition-colors duration-200`}
                            >
                                <p>{link.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2">
                        <div
                            onClick={onContactClick}
                            className="cursor-pointer bg-[#4B4B4D] hover:bg-[#EFA130] text-white hover:text-black px-4 text-sm py-2 rounded-md transition-all duration-300"
                        >
                            <p>Let&apos;s talk</p>
                        </div>
                        <div
                            onClick={() => Router.push('/login')}
                            className="cursor-pointer bg-transparent border-2 border-[#4B4B4D] hover:bg-[#4B4B4D] text-[#4B4B4D] hover:text-white px-4 text-sm py-2 rounded-full transition-all duration-300"
                        >
                            <p>Login</p>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Bar */}
                <div className="lg:hidden flex flex-row justify-between items-center px-4 h-[60px] rounded-lg ring-[0.5px] ring-[#727376] w-[92vw] sm:w-[90vw] mt-[13px] bg-white text-black shadow-lg">
                    <div onClick={onMenuClick} className="flex select-none flex-row items-center justify-center cursor-pointer p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </div>
                    <a href="/">
                        <Image alt="Codebug" src={Logo} height={40} width={140} />
                    </a>
                    <div
                        onClick={onContactClick}
                        className="cursor-pointer bg-[#4B4B4D] text-white px-4 text-sm py-2 rounded-full"
                    >
                        <p>Talk</p>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} 
                    fixed inset-0 bg-black/50 z-[998] transition-opacity duration-300 lg:hidden`}
                onClick={onMenuClick}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                    fixed top-0 left-0 w-[280px] sm:w-[320px] h-full bg-white z-[9999] shadow-2xl transition-transform duration-300 ease-out lg:hidden`}
            >
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <Image alt="Codebug" src={Logo} height={40} width={140} />
                    <div onClick={onMenuClick} className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                {/* Menu Links */}
                <div className="flex flex-col py-4">
                    {navLinks.map((link) => (
                        <div
                            key={link.key}
                            onClick={link.onClick}
                            className={`${navSelection === link.key
                                ? 'text-[#EFA130] bg-[#EFA130]/10 border-r-4 border-[#EFA130]'
                                : 'text-gray-700 hover:bg-gray-50'
                                } 
                                px-6 py-4 cursor-pointer transition-all duration-200 text-lg font-medium`}
                        >
                            {link.label}
                        </div>
                    ))}
                </div>

                {/* Menu Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
                    <button
                        onClick={() => {
                            onContactClick()
                            setIsMenuOpen(false)
                        }}
                        className="w-full bg-[#4B4B4D] hover:bg-[#EFA130] text-white hover:text-black py-3 rounded-lg font-semibold transition-all duration-300"
                    >
                        Let&apos;s Talk
                    </button>
                    <p className="text-center text-gray-500 text-sm mt-4">
                        The Only Bug You Need!
                    </p>
                </div>
            </div>
        </>
    )
}

export default Navigation;