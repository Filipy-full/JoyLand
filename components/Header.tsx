'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-sage-200 z-50 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-sage-300 group-hover:ring-sage-500 transition-all flex-shrink-0">
              <Image 
                src="/logo.jpeg" 
                alt="Joyland Logo" 
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-serif text-sage-700 group-hover:text-sage-600 transition-colors">
              Joyland
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <li>
              <Link href="/" className="text-sage-700 hover:text-sage-600 transition-colors font-medium text-sm xl:text-base">
                Home
              </Link>
            </li>
            <li>
              <Link href="/adopt" className="text-sage-700 hover:text-sage-600 transition-colors font-medium text-sm xl:text-base">
                Adoptar
              </Link>
            </li>
            <li>
              <Link href="/giftbox" className="text-sage-700 hover:text-sage-600 transition-colors font-medium text-sm xl:text-base">
                Regalar
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sage-700 hover:text-sage-600 transition-colors font-medium text-sm xl:text-base">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sage-700 hover:text-sage-600 transition-colors font-medium text-sm xl:text-base">
                Contacto
              </Link>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-sage-700 hover:text-sage-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-sage-200 pt-4">
            <ul className="flex flex-col space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/adopt" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Adoptar
                </Link>
              </li>
              <li>
                <Link 
                  href="/giftbox" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Regalar
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
