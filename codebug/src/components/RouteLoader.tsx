"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import CodebugMini from "../images/codebug-mini.png";

export default function RouteLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Keep loading visible for minimum 2 seconds
        const minDisplayTimer = setTimeout(() => {
            setIsLoading(false);

            // Fade out animation after the loading completes
            setTimeout(() => {
                setIsVisible(false);
            }, 300);
        }, 2000);

        return () => clearTimeout(minDisplayTimer);
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleStart = () => {
            setIsVisible(true);
            setIsLoading(true);
        };

        // Intercept all link clicks
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (link) {
                const href = link.getAttribute("href");
                // Only show loader for internal navigation
                if (href && href.startsWith("/") && !href.startsWith("//")) {
                    // Don't show loader for same page anchors
                    if (href !== pathname && !href.startsWith("#")) {
                        handleStart();
                    }
                }
            }
        };

        document.addEventListener("click", handleLinkClick);

        return () => {
            document.removeEventListener("click", handleLinkClick);
        };
    }, [pathname]);

    if (!isVisible) return null;

    return (
        <div
            className={`loading-overlay ${isLoading ? 'loading-visible' : 'loading-hidden'}`}
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
                zIndex: 9999,
                opacity: isLoading ? 1 : 0,
                transition: "opacity 0.3s ease-out",
                pointerEvents: isLoading ? "auto" : "none"
            }}
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "32px"
            }}>
                {/* Logo Animation */}
                <div style={{ position: "relative" }}>
                    <div style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4B4B4D, #EFA130, #8B2020)",
                        backgroundSize: "200% 200%",
                        animation: "gradientSpin 2s linear infinite, pulseScale 2s ease-in-out infinite",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 40px rgba(239, 161, 48, 0.4), 0 0 80px rgba(239, 161, 48, 0.2)"
                    }}>
                        <div style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            background: "#0a0a0a",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "15px"
                        }}>
                            <Image
                                src={CodebugMini}
                                alt="Codebug"
                                width={70}
                                height={70}
                                className="object-contain"
                                style={{ animation: "pulseScale 2s ease-in-out infinite" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading Bar */}
                <div style={{
                    width: "200px",
                    height: "4px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "2px",
                    overflow: "hidden"
                }}>
                    <div style={{
                        height: "100%",
                        width: "40%",
                        background: "linear-gradient(90deg, #4B4B4D, #EFA130, #8B2020)",
                        borderRadius: "2px",
                        animation: "loadingSlide 1.2s ease-in-out infinite"
                    }} />
                </div>

                {/* Loading Text */}
                <p style={{
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    animation: "fadeInOut 1.5s ease-in-out infinite"
                }}>Loading...</p>
            </div>

            <style jsx global>{`
        @keyframes gradientSpin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulseScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes loadingSlide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(400%); }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
