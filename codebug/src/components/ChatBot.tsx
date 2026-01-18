'use client';
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Logo from '../images/codebug.png';
import Send from '../images/arrowRight.png';
import './ChatBot.css';

type Message = {
    type: 'sender' | 'receiver';
    content: string;
    timestamp: number;
};

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messageSubmitted, setMessageSubmitted] = useState(false);
    const [message, setMessage] = useState('');
    const [messageCollection, setMessageCollection] = useState<Message[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [typing, setTyping] = useState(false);
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        let storedSessionId = localStorage.getItem('codebug_session_id');

        if (!storedSessionId) {
            storedSessionId = uuidv4();
            localStorage.setItem('codebug_session_id', storedSessionId || '');
            setSessionId(storedSessionId);
        } else {
            setSessionId(storedSessionId);
        }
    }, []);

    const fetchData = async (userMessage: string) => {
        if (!sessionId || !userMessage) return;

        const payload = { session_id: sessionId, question: userMessage };

        try {
            const response = await axios.post(
                "https://nivakaran-max.hf.space/ask",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 30000
                }
            );

            const answer = response.data?.answer || "I apologize, but I couldn't process that request. Please try again.";

            setMessageCollection((prevMessages) => [
                ...prevMessages,
                { type: "receiver", content: answer, timestamp: Date.now() }
            ]);

            setTyping(false);

        } catch (err) {
            console.error("Error invoking API: ", err);
            setMessageCollection((prevMessages) => [
                ...prevMessages,
                {
                    type: "receiver",
                    content: "I'm having trouble connecting right now. Please try again in a moment or reach out to us directly via the contact form.",
                    timestamp: Date.now()
                }
            ]);
            setTyping(false);
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messageCollection]);

    const onMessageSubmit = (msg: string) => {
        if (msg.trim()) {
            setMessageSubmitted(true);

            setMessageCollection((prevMessages) => [
                ...prevMessages,
                { type: 'sender', content: msg, timestamp: Date.now() }
            ]);

            setTyping(true);
            setMessage('');

            fetchData(msg);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onMessageSubmit(message);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Prevent body scroll on mobile when chat is open
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        };
    }, []);

    const parseMessageToJSX = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return <strong key={index}>{boldText}</strong>;
            }
            return <span className="flex" key={index}>{part}</span>;
        });
    };

    return (
        <div className={`${isOpen ? 'h-[100dvh] w-[100vw]' : ''} fixed z-[9999] text-black bottom-0 right-0`}>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                className={`absolute top-0 left-0 w-full h-full bg-black transition-opacity duration-500 ${isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Chat Toggle Button */}
            <div
                onClick={handleToggle}
                className={`${isOpen ? 'translate-y-[100px] opacity-0' : 'translate-y-0 opacity-100'} 
                    select-none transition-all duration-500 ease-in-out absolute bottom-[15px] right-[15px] sm:bottom-[20px] sm:right-[30px] 
                    flex items-center justify-center gap-2 bg-gradient-to-r from-[#4B4B4D] to-[#3a3a3a] 
                    ring-[0.5px] ring-[#727376] rounded-full cursor-pointer px-5 py-3 shadow-xl hover:shadow-2xl hover:scale-105`}
            >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <p className="select-none text-white text-[16px] sm:text-[18px] font-medium">Code</p>
            </div>

            {/* Chat Container */}
            <div
                className={`${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} 
                    chat-scrollbar absolute bottom-0 right-0 sm:bottom-[20px] sm:right-[30px] 
                    origin-bottom-right transition-all duration-500 ease-in-out 
                    flex flex-col bg-[#0a0a0a] ring-[0.5px] ring-[#727376] 
                    h-[100dvh] w-[100vw] sm:h-[600px] sm:w-[420px] sm:rounded-[12px] 
                    shadow-2xl overflow-hidden chat-container-mobile`}
            >
                {/* Header */}
                <div className="chat-header-fixed w-full shrink-0 sticky top-0 z-10 select-none px-4 sm:px-5 bg-gradient-to-r from-[#4B4B4D] to-[#3a3a3a] text-white flex flex-row justify-between items-center sm:rounded-t-[12px] pt-[calc(12px+env(safe-area-inset-top))] pb-3">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image src={Logo} alt="Codebug" width={30} height={30} className="brightness-0 invert" />
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#4B4B4D]" />
                        </div>
                        <div className="leading-tight">
                            <p className="text-[18px] sm:text-[20px] font-semibold">Code</p>
                            <p className="text-[11px] text-gray-300">AI Assistant • Online</p>
                        </div>
                    </div>
                    <div
                        onClick={handleClose}
                        className="cursor-pointer hover:bg-white/10 active:bg-white/20 p-3 -mr-1 rounded-full transition-colors touch-manipulation"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>

                {/* Messages Container */}
                {messageSubmitted ? (
                    <div
                        className="chat-content-scroll flex flex-col flex-1 overflow-y-auto py-3 sm:py-4 bg-[#0a0a0a] px-3 sm:pl-[calc(15px+env(safe-area-inset-left))] sm:pr-[calc(15px+env(safe-area-inset-right))] chat-scrollbar"
                        ref={scrollContainerRef}
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            overscrollBehavior: 'contain',
                            paddingLeft: 'max(12px, env(safe-area-inset-left))',
                            paddingRight: 'max(12px, env(safe-area-inset-right))'
                        }}
                    >
                        {/* Today Badge */}
                        <div className="flex justify-center mt-[5px] mb-[10px]">
                            <div className="bg-[#2a2a2a] text-[11px] px-3 py-1 rounded-full text-gray-400 border border-gray-600">
                                Today
                            </div>
                        </div>

                        {/* Messages */}
                        {messageCollection
                            .sort((a, b) => a.timestamp - b.timestamp)
                            .map((msg, index) => (
                                <div
                                    className={`${msg.type === 'sender' ? 'justify-end' : 'justify-start'} flex mb-3`}
                                    key={index}
                                >
                                    <div
                                        className={`${msg.type === 'sender'
                                            ? 'border border-[#1D1D1D] self-end bg-[#EFA130] text-black'
                                            : 'border border-gray-600 flex-col self-start bg-[#1a1a1a] text-white'
                                            } flex max-w-[90%] sm:max-w-[80%] text-left rounded-[12px] sm:rounded-[8px] py-[10px] sm:py-[8px] px-[14px] sm:px-[13px] text-[15px] sm:text-[14px] leading-relaxed`}
                                    >
                                        {parseMessageToJSX(msg.content)}
                                    </div>
                                </div>
                            ))}

                        {/* Typing Indicator */}
                        {typing && (
                            <div className="flex items-center justify-start mb-3">
                                <div className="typing-indicator relative">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center bg-[#f8f8f8] px-6">

                        <h3 className="text-xl font-bold text-[#171717] mb-2 text-center">Hi! I&apos;m Code</h3>
                        <p className="text-gray-600 text-center leading-relaxed mb-4 mx-[20px]">
                            I&apos;m an AI-powered assistant created by Codebug. I&apos;m here to guide you through our services and answer any questions you have. Let&apos;s explore together!
                        </p>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-sm">
                            {['What services do you offer?', 'Tell me about Codebug AI', 'How can I contact you?'].map((quick, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onMessageSubmit(quick)}
                                    className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-[#EFA130] hover:text-black hover:border-[#EFA130] transition-all duration-300"
                                >
                                    {quick}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="w-full ring-[1px] ring-[#e5e5e5] bg-white pt-2 sm:pt-[10px] pb-[calc(8px+env(safe-area-inset-bottom))] px-3 sm:px-[10px]">
                    <div className="relative">
                        <textarea
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            className="w-full focus:outline-none focus:ring-2 focus:ring-[#EFA130] min-h-[52px] sm:min-h-[48px] max-h-[120px] leading-[20px] sm:leading-[19px] rounded-[10px] sm:rounded-[8px] bg-[#f1f1f1] ring-gray-300 ring-[1px] text-black py-[12px] sm:py-[10px] px-[12px] sm:px-[10px] pr-[52px] sm:pr-[50px] resize-none text-[16px] sm:text-[14px] placeholder-gray-500"
                            placeholder="Ask Code..."
                            rows={2}
                            style={{ fontSize: '16px' }}
                        />
                        <div
                            onClick={() => onMessageSubmit(message)}
                            className="absolute top-[25px] -translate-y-1/2 right-[6px] w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] ring-[0.5px] ring-[#727376] cursor-pointer hover:bg-[#d88f20] active:bg-[#c07f18] rounded-full bg-[#EFA130] flex items-center justify-center transition-colors shadow-lg touch-manipulation"
                        >
                            <Image alt="Send" className="ml-[2px]" src={Send} height={18} width={18} />
                        </div>
                    </div>
                    <div className="text-gray-400 text-right text-[10px] sm:text-[11px] mt-1">
                        <p>Powered by Codebug Technologies</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
