'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { 
  OliveIcon, TreeIcon, LocationIcon, GalleryIcon, 
  GiftIcon, DocumentIcon, LeafIcon, HeartIcon, StarIcon 
} from '@/components/Icons'


export default function HomePage() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Generar partículas de hojas con física avanzada
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 12 + Math.random() * 8
      }))
    )

    // Parallax avanzado con mouse
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 100
      const y = (e.clientY / window.innerHeight - 0.5) * 100
      setMousePosition({ x, y })
    }

    // Parallax con scroll
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Intersection Observer con callback mejorado
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    )

    setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal')
      revealElements.forEach((el) => observerRef.current?.observe(el))
    }, 100)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      observerRef.current?.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-sage-100 to-white overflow-x-hidden relative">
      {/* Removido botão flutuante de adoção */}
      {/* Animated SVG particles */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none overflow-hidden z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-particle opacity-20"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          >
            <LeafIcon className="w-8 h-8 md:w-12 md:h-12 animate-floatRandom" />
          </div>
        ))}
      </div>

      {/* Animated blobs */}
      <div className="fixed top-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-sage-200 opacity-20 blur-3xl rounded-full animate-morph pointer-events-none"></div>
      <div className="fixed bottom-20 left-10 w-80 h-80 md:w-[500px] md:h-[500px] bg-sage-300 opacity-15 blur-3xl rounded-full animate-morph pointer-events-none" style={{ animationDelay: '3s' }}></div>

      {/* Hero Section - Glassmorphism */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4">
        <div 
          className="absolute inset-0 z-0"
          style={{
            transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px) scale(1.1)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <Image
            src="/homepage/joyland-03.jpeg"
            alt="Joyland main landscape"
            fill
            className="object-cover brightness-[0.85]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60"></div>
        </div>
        {/* Hero content with glassmorphism card */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="glass-card-dark p-6 sm:p-8 md:p-10 rounded-3xl backdrop-blur-2xl">
            <div className="mb-6 flex justify-center">
              <TreeIcon className="w-16 h-16 sm:w-20 sm:h-20 animate-breathe" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 leading-tight drop-shadow-2xl">
              <span className="text-gradient-gold inline-block animate-fadeInUp">Adopt a tree</span>{' '}
              <span className="inline-block animate-fadeInUp" style={{ animationDelay: '0.1s' }}>and support a regenerative grove.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white mb-4 leading-relaxed drop-shadow-lg animate-fadeInUp font-light" style={{ animationDelay: '0.2s' }}>
              Connect with nature and participate in an agricultural regeneration project in northern Spain. Your contribution shapes a growing ecology — year by year, tree by tree.
            </p>
            <Link 
              href="/adopt"
              className="inline-block premium-gradient text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full hover:shadow-2xl transition-all transform hover:scale-110 text-base sm:text-lg font-bold drop-shadow-lg animate-bounceIn hover-3d"
              style={{ animationDelay: '0.6s' }}
            >
              Adopt a Tree
            </Link>
          </div>
        </div>
      </section>

      {/* About Section - Glassmorphism Premium */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Imagen con efecto parallax */}
            <div 
              className="relative h-[200px] sm:h-[320px] md:h-[400px] lg:h-full rounded-2xl overflow-hidden shadow-2xl reveal reveal-left group"
            >
              <Image
                src="/homepage/image1.jpg"
                alt="Paisaje natural"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                style={{ objectPosition: '50% 40%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-700/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Contenido con glassmorphism */}
            <div className="reveal reveal-right">
              <div className="glass-card p-5 sm:p-6 md:p-8 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-5 text-center sm:text-left">
                  <OliveIcon className="w-10 h-10 sm:w-12 sm:h-12 animate-floatRandom flex-shrink-0" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-sage-700">
                    What is Joyland?
                  </h2>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-sm sm:text-base md:text-lg text-sage-800 leading-relaxed">
                    Joyland is a regenerative agricultural project rooted in stewardship, observation, and care for natural rhythms. Here, olives and almonds grow within a diverse ecosystem where soil life, wild plants, insects, trees, and people all play a role. When you adopt a tree you support regenerative practices that encourage biodiversity, enrich the land, strengthen the soil, and build resilience.
                  </p>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-sage-700">
                    Joyland Tree Adoption
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-sage-800 leading-relaxed">
                    Through an adoption, you follow the growth of your tree within a sprouting food forest — learning how soil, biodiversity, and time work together to support resilient trees and landscapes. You will receive updates on your tree's progress, seasonal photos and the products it generates. A way to support natural living systems while staying closely connected to the land that nourishes them.
                  </p>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center flex-nowrap">
                  <div className="glass-card-dark px-4 sm:px-6 py-2 sm:py-3 rounded-full flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1">🌱</span>
                    <span className="text-sm sm:text-base text-sage-700 font-semibold">Regenerative</span>
                  </div>
                  <div className="glass-card-dark px-4 sm:px-6 py-2 sm:py-3 rounded-full flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1">🌍</span>
                    <span className="text-sm sm:text-base text-sage-700 font-semibold">Sustainable</span>
                  </div>
                  <div className="glass-card-dark px-4 sm:px-6 py-2 sm:py-3 rounded-full flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1">💚</span>
                    <span className="text-sm sm:text-base text-sage-700 font-semibold">Transparent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section con hover 3D */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-sage-50/50 to-white"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 reveal reveal-up">
            <div className="flex justify-center mb-4">
              <div className="golden-gradient p-3 sm:p-4 rounded-full">
                <OliveIcon className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-sage-700 mb-3 bg-transparent" style={{background:'transparent'}}>
              Our Olive Grove
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-sage-600 max-w-xl mx-auto bg-transparent" style={{background:'transparent'}}>
              Views of our regenerative orchard
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              { img: '/homepage/image2.jpg', title: 'Ripening olive', delay: '0s' },
              { img: '/homepage/image3.jpg', title: 'Olive tree', delay: '0.1s' },
              { img: '/homepage/image4.jpg', title: 'Green grove', delay: '0.2s' }
            ].map((item, i) => (
              <div 
                key={i}
                className="relative h-56 sm:h-64 md:h-72 rounded-2xl overflow-hidden shadow-xl hover-3d reveal reveal-up cursor-pointer group"
                style={{ animationDelay: item.delay }}
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                  <div className="glass-card-dark w-full p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white font-bold text-base sm:text-lg md:text-xl">{item.title}</p>
                  </div>
                </div>
                {/* Sparkles decorativos */}
                <div className="absolute top-4 right-4 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-sparkle"></div>
                <div className="absolute top-8 right-8 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-sparkle" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included - Grid Premium con Iconos SVG */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-sage-50 to-white"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 reveal reveal-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-sage-700 mb-3">
              What your adoption includes
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-sage-400 via-sage-600 to-sage-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: LocationIcon, title: 'Your Personal Tree', desc: 'Upon invitation you can come to your tree for a visit, a real harvest, or a hug.', delay: '0s' },
              { icon: GalleryIcon, title: '📸 Seasonal Updates', desc: 'Follow your tree through the year with our interactive map, photos, short videos, and gentle updates from the grove and your adoption.', delay: '0.1s' },
              { icon: GiftIcon, title: ' Natural Harvest Gifts', desc: 'Receive a giftbox with artisanal products made from the land — Joyland olive oil, almonds, dried herbs and more.', delay: '0.2s' },
              { icon: DocumentIcon, title: '🌱 Annual Land & Tree Report', desc: 'A printed yearly overview added to your giftbox, sharing how your tree and the wider ecosystem are growing, evolving, and flourishing.', delay: '0.3s' },
              { icon: LeafIcon, title: '🐝 Regenerative Stewardship', desc: 'Your adoption supports practices that build soil health, stimulate biodiversity, and care for the land as a living whole.', delay: '0.4s' },
              { icon: HeartIcon, title: '🎁 A Gift That Grows', desc: 'Adopt a tree for yourself or gift it to someone you love, complete with a personalized adoption certificate.', delay: '0.5s' },
            ].map((item, i) => (
              <div 
                key={i}
                className="glass-card p-5 sm:p-6 rounded-2xl hover-3d reveal reveal-up cursor-pointer group transition-all duration-500 hover:shadow-2xl"
                style={{ animationDelay: item.delay }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 sm:mb-4 p-3 sm:p-4 rounded-full bg-gradient-to-br from-sage-100 to-sage-200 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                    <item.icon className="w-8 h-8 sm:w-10 sm:h-10 animate-floatRandom" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif text-sage-700 mb-2 sm:mb-3 group-hover:text-sage-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-sage-700 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                {/* Borde animado */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-sage-400 via-sage-600 to-sage-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" style={{ padding: '2px' }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ...existing code... */}


    </div>
  )
}
