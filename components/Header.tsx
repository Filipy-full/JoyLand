import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <>
      {/* Top Banner - Fixed */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white text-center py-2.5 text-sm font-semibold z-50 shadow-md">
        ⚡ ÚLTIMA OPORTUNIDAD: Solo 15 árboles disponibles · Envío GRATIS 📦
      </div>
      
      {/* Main Header */}
      <header className="fixed top-10 w-full bg-white/95 backdrop-blur-md border-b border-orange-100 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-200 group-hover:ring-orange-400 transition-all">
              <Image 
                src="/logo.jpeg" 
                alt="Joyland Logo" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-2xl font-serif text-orange-900 group-hover:text-orange-700 transition-colors">
              Joyland
            </span>
          </Link>
          
          <ul className="flex items-center space-x-8">
            <li>
              <Link href="/" className="text-orange-800 hover:text-orange-600 transition-colors font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="/adopt" className="text-orange-800 hover:text-orange-600 transition-colors font-medium">
                Adopt a Tree
              </Link>
            </li>
            <li>
              <Link href="/giftbox" className="text-orange-800 hover:text-orange-600 transition-colors font-medium">
                Giftbox
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-orange-800 hover:text-orange-600 transition-colors font-medium">
                About
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-orange-800 hover:text-orange-600 transition-colors font-medium">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-orange-800 hover:text-orange-600 transition-colors font-medium">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    </>
  )
}
