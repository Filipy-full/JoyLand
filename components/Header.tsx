'use client'


import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MyAdoptionsButton } from '@/components/MyAdoptionsButton'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        const allowedAdmins = ['filipyhenrique54@gmail.com', 'joylandspain@gmail.com', 'info@joylandweb.com'];
        setIsAdmin(!!user.email && allowedAdmins.includes(user.email));
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };
    checkUser();
    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-sage-200 z-50 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="relative w-28 h-12 sm:w-36 sm:h-16 flex-shrink-0">
                  {/* Logo mais comprido, altura menor */}
              <Image 
                src="/logotest1.png" 
                alt="Joyland Logo" 
                fill
                sizes="98px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl sm:text-2xl font-serif text-sage-700 group-hover:text-sage-600 transition-colors">
              
              {/* Titulo al lado del logo */}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <div className="flex items-center space-x-6 xl:space-x-8 group">
              {[
                { href: '/', label: 'Home' },
                { href: '/adopt', label: 'Adopt' },
                { href: '/giftbox', label: 'Giftbox' },
                { href: '/impact', label: 'Impact' },
                { href: '/about', label: 'About' },
                { href: '/galeria', label: 'Gallery' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={
                      `relative text-sage-700 hover:text-sage-600 transition-colors font-medium text-sm xl:text-base px-1
                      after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:content-['']
                      after:bg-green-500 after:scale-x-0 after:transition-transform after:duration-300 after:origin-left
                      hover:after:scale-x-100` +
                      (pathname === href ? ' after:scale-x-100 group-hover:after:scale-x-0' : '')
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </div>
            {isAdmin && (
              <li>
                <Link href="/admin" className={`relative text-sage-700 hover:text-sage-600 transition-colors font-medium text-sm xl:text-base px-1${pathname === '/admin' ? ' after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-1 after:bg-green-500 after:rounded-full after:content-[""]' : ''}`}>
                  Dashboard
                </Link>
              </li>
            )}
            {isLoggedIn ? (
              <li>
                <button onClick={handleLogout} className="text-sage-700 hover:text-sage-600 transition-colors font-medium text-sm xl:text-base">
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link href="/login" className={`relative text-sage-700 hover:text-sage-600 transition-colors font-medium text-sm xl:text-base px-1${pathname === '/login' ? ' after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-1 after:bg-green-500 after:rounded-full after:content-[""]' : ''}`}>
                  Login
                </Link>
              </li>
            )}
          </ul>
          {/* Botão MyAdoptions só aparece se logado e tiver adoção */}
          {isLoggedIn && (
            <>
              <div className="hidden lg:block ml-6">
                <MyAdoptionsButton className="bg-sage-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-sage-700 transition-all" />
              </div>
              <div className="block lg:hidden ml-2">
                <MyAdoptionsButton className="bg-sage-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-sage-700 transition-all" />
              </div>
            </>
          )}
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
                  Adopt
                </Link>
              </li>
              <li>
                <Link 
                  href="/galeria" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link 
                  href="/giftbox" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gift
                </Link>
              </li>
              <li>
                <Link 
                  href="/impact" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Impact
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              {isAdmin && (
                <>
                  <li>
                    <Link
                      href="/admin"
                      className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
              {isLoggedIn ? (
                <li>
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <Link 
                    href="/login" 
                    className="block text-sage-700 hover:text-sage-600 transition-colors font-medium py-2 hover:bg-sage-50 px-3 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
