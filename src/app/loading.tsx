"use client";

export default function Loading() {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                {/* Logo/Brand Mark */}
                <div className="loading-logo">
                    <div className="logo-circle">
                        <div className="logo-inner">
                            <span className="logo-text">C</span>
                        </div>
                    </div>
                </div>

                {/* Animated Loading Bar */}
                <div className="loading-bar-container">
                    <div className="loading-bar"></div>
                </div>

                {/* Loading Text */}
                <p className="loading-text">Loading...</p>
            </div>

            <style jsx>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
          z-index: 9999;
        }

        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
        }

        .loading-logo {
          position: relative;
        }

        .logo-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4B4B4D, #EFA130, #8B2020);
          background-size: 200% 200%;
          animation: gradientSpin 2s linear infinite, pulse 2s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 0 40px rgba(239, 161, 48, 0.4),
            0 0 80px rgba(239, 161, 48, 0.2);
        }

        .logo-inner {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #EFA130, #8B2020);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .loading-bar-container {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .loading-bar {
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, #4B4B4D, #EFA130, #8B2020);
          border-radius: 2px;
          animation: loadingSlide 1.2s ease-in-out infinite;
        }

        .loading-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          animation: fadeInOut 1.5s ease-in-out infinite;
        }

        @keyframes gradientSpin {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes loadingSlide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(200%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}
