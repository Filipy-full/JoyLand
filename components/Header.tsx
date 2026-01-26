import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-sage-200 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-sage-300 group-hover:ring-sage-500 transition-all">
              <Image 
                src="/logo.jpeg" 
                alt="Joyland Logo" 
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-2xl font-serif text-sage-700 group-hover:text-sage-600 transition-colors">
              Joyland
            </span>
          </Link>
          
          {/* Navigation */}
          <ul className="flex items-center space-x-8">
            <li>
              <Link href="/" className="text-sage-700 hover:text-sage-600 transition-colors font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link href="/adopt" className="text-sage-700 hover:text-sage-600 transition-colors font-medium">
                Adoptar
              </Link>
            </li>
            <li>
              <Link href="/giftbox" className="text-sage-700 hover:text-sage-600 transition-colors font-medium">
                Regalar
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sage-700 hover:text-sage-600 transition-colors font-medium">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sage-700 hover:text-sage-600 transition-colors font-medium">
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
