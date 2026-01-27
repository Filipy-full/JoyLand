'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function FloatingCTA() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Don't show on adopt pages or success page
  if (pathname?.includes('/adopt') || pathname?.includes('/tree/')) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 float-animation">
        {/* Animated pulse rings */}
        {showPulse && (
          <>
            <div className="absolute inset-0 rounded-full bg-green-400/30 pulse-ring"></div>
            <div className="absolute inset-0 rounded-full bg-green-400/20 pulse-ring" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
        
        {/* Main button */}
        <Link
          href="/adopt"
          className="relative group flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white px-5 py-3 sm:px-8 sm:py-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-500 font-bold text-sm sm:text-lg overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Sparkle effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-3/4 left-3/4 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          {/* Icon */}
          <span className={`relative text-xl sm:text-2xl transition-transform duration-300 ${isHovered ? 'scale-125 shake-animation' : ''}`}>
            🌱
          </span>
          
          {/* Text */}
          <span className="relative hidden sm:inline whitespace-nowrap">ADOPTAR AHORA</span>
          <span className="relative sm:hidden whitespace-nowrap">ADOPTAR</span>
          
          {/* Arrow */}
          <svg 
            className={`relative w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
          
        </Link>
      </div>
    </>
  )
}
